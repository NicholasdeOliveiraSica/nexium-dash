import type { Database } from '~/types/database.types'

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export function useTransactions() {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros estáticos/reativos
  const selectedMonth = ref<number>(new Date().getMonth()) // 0-11
  const selectedYear = ref<number>(new Date().getFullYear())
  const selectedType = ref<'all' | 'income' | 'expense'>('all')
  const searchQuery = ref('')
  const selectedCategory = ref<string>('all')

  // Buscar transações
  async function fetchTransactions() {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      transactions.value = data || []
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err)
      error.value = err?.message || 'Erro ao carregar movimentações.'
    } finally {
      loading.value = false
    }
  }

  // Inserir transação
  async function addTransaction(payload: {
    description: string
    amount: number
    type: 'income' | 'expense'
    category: string
    created_at?: string
  }) {
    if (!user.value) throw new Error('Usuário não autenticado.')

    const newTx: TransactionInsert = {
      user_id: user.value.id,
      description: payload.description,
      amount: payload.amount,
      type: payload.type,
      category: payload.category || 'Geral',
      created_at: payload.created_at || new Date().toISOString()
    }

    const { data, error: err } = await supabase
      .from('transactions')
      .insert(newTx)
      .select()
      .single()

    if (err) throw err

    // Adiciona localmente se não veio via realtime ainda
    if (data && !transactions.value.some(t => t.id === data.id)) {
      transactions.value.unshift(data)
    }

    return data
  }

  // Atualizar transação
  async function updateTransaction(
    id: string,
    payload: {
      description?: string
      amount?: number
      type?: 'income' | 'expense'
      category?: string
      created_at?: string
    }
  ) {
    const updatePayload: TransactionUpdate = { ...payload }

    const { data, error: err } = await supabase
      .from('transactions')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err

    if (data) {
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx !== -1) {
        transactions.value[idx] = data
      }
    }

    return data
  }

  // Deletar transação
  async function deleteTransaction(id: string) {
    const { error: err } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (err) throw err

    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  // Supabase Realtime Subscription
  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  function setupRealtime() {
    if (realtimeChannel) return

    realtimeChannel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTx = payload.new as Transaction
            if (!transactions.value.some(t => t.id === newTx.id)) {
              transactions.value.unshift(newTx)
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedTx = payload.new as Transaction
            const idx = transactions.value.findIndex(t => t.id === updatedTx.id)
            if (idx !== -1) {
              transactions.value[idx] = updatedTx
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id
            transactions.value = transactions.value.filter(t => t.id !== deletedId)
          }
        }
      )
      .subscribe()
  }

  function cleanupRealtime() {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }

  // Lifecycle
  onMounted(() => {
    fetchTransactions()
    setupRealtime()
  })

  onUnmounted(() => {
    cleanupRealtime()
  })

  // Transações filtradas por mês, ano, tipo, busca e categoria
  const filteredTransactions = computed(() => {
    return transactions.value.filter((t) => {
      const date = new Date(t.created_at)
      const matchMonth = date.getMonth() === selectedMonth.value
      const matchYear = date.getFullYear() === selectedYear.value

      const matchType = selectedType.value === 'all' || t.type === selectedType.value
      const matchCategory = selectedCategory.value === 'all' || t.category === selectedCategory.value

      const matchSearch = !searchQuery.value ||
        t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.value.toLowerCase())

      return matchMonth && matchYear && matchType && matchCategory && matchSearch
    })
  })

  // Totais computados sobre as transações filtradas do mês
  const totalIncome = computed(() => {
    return filteredTransactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  })

  const totalExpense = computed(() => {
    return filteredTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  })

  const totalBalance = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  // Categorias únicas existentes para o filtro
  const categoriesList = computed(() => {
    const defaultCategories = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Salário', 'Investimentos', 'Saúde', 'Educação', 'Geral']
    const existing = new Set(transactions.value.map(t => t.category))
    defaultCategories.forEach(c => existing.add(c))
    return Array.from(existing)
  })

  return {
    transactions,
    filteredTransactions,
    loading,
    error,
    selectedMonth,
    selectedYear,
    selectedType,
    searchQuery,
    selectedCategory,
    categoriesList,
    totalIncome,
    totalExpense,
    totalBalance,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
}
