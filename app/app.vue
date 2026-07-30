<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})

const title = 'Nexium Finance'
const description = 'Gerenciamento financeiro simples, elegante e em tempo real.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      <header class="border-b border-neutral-800 px-6 py-4 flex items-center justify-between bg-neutral-900/30 backdrop-blur">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <UIcon name="i-lucide-wallet" class="w-6 h-6 text-primary" />
          <span>Nexium Finance</span>
        </NuxtLink>

        <UColorModeButton />
      </header>

      <main class="flex-1">
        <NuxtPage />
      </main>

      <footer class="border-t border-neutral-800 px-6 py-4 text-center text-xs text-neutral-500">
        Nexium Finance • © {{ new Date().getFullYear() }}
      </footer>
    </div>
  </UApp>
</template>
