<script setup lang="ts">
const props = defineProps<{
  income: number
  expense: number
  balance: number
  loading?: boolean
}>()

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val || 0)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card de Entradas -->
    <UCard class="bg-neutral-900/60 border-neutral-800/80 shadow-md backdrop-blur">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Entradas
          </p>
          <div v-if="loading" class="h-8 w-24 bg-neutral-800 animate-pulse rounded mt-1" />
          <h3 v-else class="text-2xl font-bold text-emerald-400 mt-1">
            {{ formatCurrency(props.income) }}
          </h3>
        </div>
        <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <UIcon name="i-lucide-trending-up" class="w-6 h-6" />
        </div>
      </div>
    </UCard>

    <!-- Card de Saídas -->
    <UCard class="bg-neutral-900/60 border-neutral-800/80 shadow-md backdrop-blur">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Saídas
          </p>
          <div v-if="loading" class="h-8 w-24 bg-neutral-800 animate-pulse rounded mt-1" />
          <h3 v-else class="text-2xl font-bold text-rose-400 mt-1">
            {{ formatCurrency(props.expense) }}
          </h3>
        </div>
        <div class="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
          <UIcon name="i-lucide-trending-down" class="w-6 h-6" />
        </div>
      </div>
    </UCard>

    <!-- Card de Balanço -->
    <UCard class="bg-neutral-900/60 border-neutral-800/80 shadow-md backdrop-blur">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Balanço do Mês
          </p>
          <div v-if="loading" class="h-8 w-24 bg-neutral-800 animate-pulse rounded mt-1" />
          <h3
            v-else
            class="text-2xl font-bold mt-1"
            :class="props.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'"
          >
            {{ formatCurrency(props.balance) }}
          </h3>
        </div>
        <div
          class="p-3 rounded-xl"
          :class="props.balance >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'"
        >
          <UIcon name="i-lucide-wallet" class="w-6 h-6" />
        </div>
      </div>
    </UCard>
  </div>
</template>
