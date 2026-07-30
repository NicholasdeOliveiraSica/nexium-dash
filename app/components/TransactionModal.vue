<script setup lang="ts">
import type { Transaction } from '~/composables/useTransactions'

const props = defineProps<{
  open: boolean
  transactionToEdit?: Transaction | null
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'saved'): void
}>()

const { addTransaction, updateTransaction } = useTransactions()
const toast = useToast()

const description = ref('')
const amount = ref<string>('')
const type = ref<'income' | 'expense'>('expense')
const category = ref('Alimentação')
const dateStr = ref(new Date().toISOString().substring(0, 10))

const loading = ref(false)
const errorMessage = ref('')

const isEditing = computed(() => !!props.transactionToEdit)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.transactionToEdit) {
        description.value = props.transactionToEdit.description
        amount.value = String(props.transactionToEdit.amount)
        type.value = props.transactionToEdit.type
        category.value = props.transactionToEdit.category
        dateStr.value = new Date(props.transactionToEdit.created_at).toISOString().substring(0, 10)
      } else {
        description.value = ''
        amount.value = ''
        type.value = 'expense'
        category.value = 'Alimentação'
        dateStr.value = new Date().toISOString().substring(0, 10)
      }
      errorMessage.value = ''
    }
  }
)

async function handleSubmit() {
  if (!description.value.trim()) {
    errorMessage.value = 'Informe uma descrição.'
    return
  }

  if (amount.value === '' || Number(amount.value) <= 0) {
    errorMessage.value = 'Informe um valor maior que zero.'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const isoDate = new Date(dateStr.value).toISOString()

    if (isEditing.value && props.transactionToEdit) {
      await updateTransaction(props.transactionToEdit.id, {
        description: description.value.trim(),
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        created_at: isoDate
      })

      toast.add({
        title: 'Movimentação Atualizada',
        description: 'Os dados da transação foram salvos com sucesso.',
        color: 'success'
      })
    } else {
      await addTransaction({
        description: description.value.trim(),
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        created_at: isoDate
      })

      toast.add({
        title: 'Movimentação Adicionada',
        description: 'Nova transação registrada com sucesso!',
        color: 'success'
      })
    }

    emit('saved')
    emit('update:open', false)
  } catch (err: any) {
    console.error('Erro ao salvar transação:', err)
    errorMessage.value = err?.message || 'Erro ao salvar movimentação.'
    toast.add({
      title: 'Erro ao Salvar',
      description: errorMessage.value,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const defaultCategories = [
  'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Salário', 'Investimentos', 'Saúde', 'Educação', 'Geral'
]
</script>

<template>
  <UModal
    :open="props.open"
    :title="isEditing ? 'Editar Movimentação' : 'Nova Movimentação'"
    :description="isEditing ? 'Atualize os detalhes da transação selecionada.' : 'Preencha os dados abaixo para registrar uma nova transação.'"
    @update:open="(val) => emit('update:open', val)"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :title="errorMessage"
        />

        <!-- Tipo: Entrada / Saída -->
        <UFormField label="Tipo de Movimentação" required>
          <div class="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              class="flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold transition-all"
              :class="type === 'expense' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'"
              @click="type = 'expense'"
            >
              <UIcon name="i-lucide-trending-down" class="w-4 h-4 text-rose-400" />
              Saída
            </button>

            <button
              type="button"
              class="flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold transition-all"
              :class="type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'"
              @click="type = 'income'"
            >
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-emerald-400" />
              Entrada
            </button>
          </div>
        </UFormField>

        <!-- Descrição -->
        <UFormField label="Descrição" required name="description">
          <UInput
            v-model="description"
            placeholder="Ex: Mercado mensal, Salário, Uber"
            icon="i-lucide-file-text"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <!-- Valor -->
        <UFormField label="Valor (R$)" required name="amount">
          <UInput
            v-model="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            icon="i-lucide-dollar-sign"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <!-- Categoria -->
        <UFormField label="Categoria" required name="category">
          <select
            v-model="category"
            class="w-full bg-neutral-900 text-white text-sm border border-neutral-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            :disabled="loading"
          >
            <option v-for="cat in defaultCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </UFormField>

        <!-- Data -->
        <UFormField label="Data" required name="date">
          <UInput
            v-model="dateStr"
            type="date"
            icon="i-lucide-calendar"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <div class="flex items-center justify-end gap-3 pt-4">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            :disabled="loading"
            @click="emit('update:open', false)"
          >
            Cancelar
          </UButton>
          <UButton
            color="primary"
            type="submit"
            :loading="loading"
          >
            {{ isEditing ? 'Salvar Alterações' : 'Adicionar' }}
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
