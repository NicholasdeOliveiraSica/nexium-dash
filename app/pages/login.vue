<script setup lang="ts">
import { normalizeLoginToEmail } from '~/utils/auth'

definePageMeta({
  layout: 'default'
})

const supabase = useSupabaseClient()
const router = useRouter()

const loginInput = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!loginInput.value.trim() || !password.value) {
    errorMessage.value = 'Por favor, preencha o login e a senha.'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const emailToUse = normalizeLoginToEmail(loginInput.value)

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message === 'Invalid login credentials' 
        ? 'Login ou senha incorretos.' 
        : error.message
      return
    }

    await router.push('/dash')
  } catch (err: any) {
    errorMessage.value = err?.message || 'Erro inesperado ao realizar login.'
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
            Nexium Finance
          </h1>
          <p class="text-sm text-neutral-400">
            Informe seu login e senha para acessar
          </p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :title="errorMessage"
          class="mb-4"
        />

        <UFormField label="Login" required name="loginInput">
          <UInput
            v-model="loginInput"
            type="text"
            placeholder="Ex: mailane ou nicholas"
            icon="i-lucide-user"
            autocomplete="username"
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
            autocomplete="current-password"
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
          Entrar
        </UButton>
      </form>
    </UCard>
  </div>
</template>
