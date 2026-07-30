<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const supabase = useSupabaseClient()

const email = ref('contato.nexium.studio@gmail.com')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    successMessage.value = 'Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.'
  } catch (err: any) {
    errorMessage.value = err?.message || 'Erro inesperado ao realizar cadastro.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <UCard class="w-full max-w-md shadow-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
      <template #header>
        <div class="text-center space-y-1">
          <h1 class="text-2xl font-bold tracking-tight text-white">
            Criar Conta - Nexium
          </h1>
          <p class="text-sm text-neutral-400">
            Cadastre-se para ter acesso ao controle financeiro
          </p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :title="errorMessage"
          class="mb-4"
        />

        <UAlert
          v-if="successMessage"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          :title="successMessage"
          class="mb-4"
        />

        <UFormField label="E-mail" required name="email" help="E-mail principal para confirmação e acesso">
          <UInput
            v-model="email"
            type="email"
            placeholder="contato.nexium.studio@gmail.com"
            icon="i-lucide-mail"
            autocomplete="email"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Senha" required name="password">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            autocomplete="new-password"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Confirmar Senha" required name="confirmPassword">
          <UInput
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            autocomplete="new-password"
            class="w-full"
            :disabled="loading"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          color="primary"
          size="lg"
          :loading="loading"
          class="mt-6 w-full justify-center"
        >
          Cadastrar
        </UButton>
      </form>

      <template #footer>
        <div class="text-center text-sm text-neutral-400">
          Já possui uma conta?
          <NuxtLink to="/login" class="text-primary font-medium hover:underline ml-1">
            Fazer login
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
