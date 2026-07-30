<script setup lang="ts">
import type { Transaction } from '~/composables/useTransactions'

const props = defineProps<{
  transactions: Transaction[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', tx: Transaction): void
  (e: 'delete', id: string): void
}>()

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val || 0)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const deletingId = ref<string | null>(null)

function confirmDelete(id: string) {
  deletingId.value = id
}

function cancelDelete() {
  deletingId.value = null
}

function executeDelete(id: string) {
  emit('delete', id)
  deletingId.value = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- Estado de carregamento -->
    <div v-if="props.loading" class="space-y-3 p-4">
      <div v-for="i in 4" :key="i" class="h-16 bg-neutral-900/60 animate-pulse rounded-xl" />
    </div>

    <!-- Estado vazio -->
    <UCard v-else-if="props.transactions.length === 0" class="bg-neutral-900/40 border-neutral-800 text-center py-12">
      <div class="space-y-3">
        <UIcon name="i-lucide-receipt" class="w-12 h-12 text-neutral-600 mx-auto" />
        <h4 class="text-base font-semibold text-neutral-300">
          Nenhuma movimentação encontrada
        </h4>
        <p class="text-xs text-neutral-500 max-w-sm mx-auto">
          Não há registros para o filtro ou mês selecionado. Adicione uma nova movimentação usando o botão acima.
        </p>
      </div>
    </UCard>

    <!-- Lista de Transações (Desktop & Mobile) -->
    <div v-else class="bg-neutral-900/60 border border-neutral-800/80 rounded-xl overflow-hidden backdrop-blur">
      <!-- Tabela Desktop -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-neutral-900/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
            <tr>
              <th class="py-3 px-4">Data</th>
              <th class="py-3 px-4">Descrição</th>
              <th class="py-3 px-4">Categoria</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4 text-right">Valor</th>
              <th class="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/60 text-neutral-300">
            <tr
              v-for="tx in props.transactions"
              :key="tx.id"
              class="hover:bg-neutral-800/30 transition-colors"
            >
              <td class="py-3 px-4 text-neutral-400 whitespace-nowrap">
                {{ formatDate(tx.created_at) }}
              </td>
              <td class="py-3 px-4 font-medium text-white">
                {{ tx.description }}
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {{ tx.category }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                  :class="tx.type === 'income' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'"
                >
                  <UIcon :name="tx.type === 'income' ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-down-right'" class="w-3.5 h-3.5" />
                  {{ tx.type === 'income' ? 'Entrada' : 'Saída' }}
                </span>
              </td>
              <td
                class="py-3 px-4 text-right font-bold whitespace-nowrap"
                :class="tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'"
              >
                {{ tx.type === 'income' ? '+' : '-' }} {{ formatCurrency(Number(tx.amount)) }}
              </td>
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1">
                  <UButton
                    icon="i-lucide-edit-2"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    aria-label="Editar"
                    @click="emit('edit', tx)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    variant="ghost"
                    size="xs"
                    aria-label="Excluir"
                    @click="confirmDelete(tx.id)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Lista Cards Mobile -->
      <div class="block md:hidden divide-y divide-neutral-800">
        <div
          v-for="tx in props.transactions"
          :key="tx.id"
          class="p-4 space-y-2 hover:bg-neutral-800/20 transition-colors"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs text-neutral-500">
              {{ formatDate(tx.created_at) }}
            </span>
            <span class="text-xs font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {{ tx.category }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-white text-base">
              {{ tx.description }}
            </h4>
            <span
              class="font-bold text-base"
              :class="tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'"
            >
              {{ tx.type === 'income' ? '+' : '-' }} {{ formatCurrency(Number(tx.amount)) }}
            </span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <UButton
              icon="i-lucide-edit-2"
              color="neutral"
              variant="ghost"
              size="xs"
              label="Editar"
              @click="emit('edit', tx)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              label="Excluir"
              @click="confirmDelete(tx.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <UModal
      :open="!!deletingId"
      title="Excluir Movimentação"
      description="Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita."
      @update:open="(val) => { if (!val) cancelDelete() }"
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="cancelDelete">
            Cancelar
          </UButton>
          <UButton color="error" @click="executeDelete(deletingId!)">
            Confirmar Exclusão
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
