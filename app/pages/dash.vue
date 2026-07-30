<script setup lang="ts">
import type { Transaction } from '~/composables/useTransactions'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const {
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
  deleteTransaction
} = useTransactions()

const modalOpen = ref(false)
const transactionToEdit = ref<Transaction | null>(null)

const toast = useToast()

function openCreateModal() {
  transactionToEdit.value = null
  modalOpen.value = true
}

function openEditModal(tx: Transaction) {
  transactionToEdit.value = tx
  modalOpen.value = true
}

async function handleDelete(id: string) {
  try {
    await deleteTransaction(id)
    toast.add({
      title: 'Movimentação Excluída',
      description: 'A transação foi removida com sucesso.',
      color: 'success'
    })
  } catch (err: any) {
    console.error('Erro ao excluir transação:', err)
    toast.add({
      title: 'Erro ao Excluir',
      description: err?.message || 'Não foi possível excluir a movimentação.',
      color: 'error'
    })
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
    <!-- Cabeçalho da Dashboard -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Dashboard Financeiro
          </h1>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Realtime
          </span>
        </div>
        <p class="text-xs md:text-sm text-neutral-400 mt-1">
          {{ user?.email || 'Usuário' }} • Controle de movimentações do casal
        </p>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <UButton
          color="primary"
          icon="i-lucide-plus"
          size="md"
          class="font-semibold shadow-lg"
          @click="openCreateModal"
        >
          Nova Transação
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-log-out"
          size="md"
          aria-label="Sair da conta"
          @click="handleLogout"
        />
      </div>
    </div>

    <!-- Alerta de Erro -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      :title="error"
    />

    <!-- Cards de Resumo -->
    <TransactionSummaryCards
      :income="totalIncome"
      :expense="totalExpense"
      :balance="totalBalance"
      :loading="loading"
    />

    <!-- Barra de Filtros -->
    <TransactionFilterBar
      v-model:month="selectedMonth"
      v-model:year="selectedYear"
      v-model:type="selectedType"
      v-model:category="selectedCategory"
      v-model:search="searchQuery"
      :categories="categoriesList"
    />

    <!-- Lista / Tabela de Transações -->
    <TransactionList
      :transactions="filteredTransactions"
      :loading="loading"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- Modal de Adicionar / Editar -->
    <TransactionModal
      v-model:open="modalOpen"
      :transaction-to-edit="transactionToEdit"
      :categories="categoriesList"
    />

    <!-- Botão Flutuante (FAB) para Mobile -->
    <div class="fixed bottom-6 right-6 md:hidden z-40">
      <button
        type="button"
        class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/40 active:scale-95 transition-all"
        aria-label="Adicionar movimentação"
        @click="openCreateModal"
      >
        <UIcon name="i-lucide-plus" class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>
