<script setup lang="ts">
const props = defineProps<{
  month: number
  year: number
  type: 'all' | 'income' | 'expense'
  category: string
  search: string
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'update:month', val: number): void
  (e: 'update:year', val: number): void
  (e: 'update:type', val: 'all' | 'income' | 'expense'): void
  (e: 'update:category', val: string): void
  (e: 'update:search', val: string): void
}>()

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function prevMonth() {
  if (props.month === 0) {
    emit('update:month', 11)
    emit('update:year', props.year - 1)
  } else {
    emit('update:month', props.month - 1)
  }
}

function nextMonth() {
  if (props.month === 11) {
    emit('update:month', 0)
    emit('update:year', props.year + 1)
  } else {
    emit('update:month', props.month + 1)
  }
}

const typeOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Entradas', value: 'income' },
  { label: 'Saídas', value: 'expense' }
]
</script>

<template>
  <div class="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 space-y-4 backdrop-blur">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Seletor de Mês / Ano -->
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Mês anterior"
          @click="prevMonth"
        />
        <div class="text-center min-w-[140px]">
          <span class="text-base font-bold text-white">
            {{ monthNames[props.month] }}
          </span>
          <span class="text-xs text-neutral-400 block">
            {{ props.year }}
          </span>
        </div>
        <UButton
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Próximo mês"
          @click="nextMonth"
        />
      </div>

      <!-- Filtros Secundários -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Busca -->
        <UInput
          :model-value="props.search"
          placeholder="Buscar descrição..."
          icon="i-lucide-search"
          size="sm"
          class="w-full sm:w-48"
          @update:model-value="(val) => emit('update:search', String(val))"
        />

        <!-- Filtro por Tipo -->
        <div class="flex items-center bg-neutral-800/60 p-1 rounded-lg border border-neutral-700/50">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            type="button"
            class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
            :class="props.type === opt.value ? 'bg-primary text-white shadow-sm' : 'text-neutral-400 hover:text-white'"
            @click="emit('update:type', opt.value as any)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Filtro por Categoria -->
        <select
          :value="props.category"
          class="bg-neutral-800/80 text-white text-xs border border-neutral-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          @change="(e: any) => emit('update:category', e.target.value)"
        >
          <option value="all">Todas as Categorias</option>
          <option v-for="cat in props.categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
