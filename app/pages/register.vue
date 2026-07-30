<script setup lang="ts">
import { normalizeLoginToEmail } from '~/utils/auth'

definePageMeta({
  layout: 'default'
})

const supabase = useSupabaseClient()

const loginInput = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  if (!loginInput.value.trim() || !password.value || !confirmPassword.value) {
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

    const emailToUse = normalizeLoginToEmail(loginInput.value)

    const { error } = await supabase.auth.signUp({
      email: emailToUse,
      password: password.value,
      options: {
        data: {
          username: loginInput.value.trim().toLowerCase()
        }
      }
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    successMessage.value = 'Cadastro realizado com sucesso! Por favor, confirme pelo e-mail enviado.'
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
            Cadastrar Novo Usuário
          </h1>
          <p class="text-sm text-neutral-400">
            Criação de acesso para o sistema financeiro
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

        <UFormField label="Novo login" required name="loginInput">
          <UInput
            v-model="loginInput"
            type="text"
            placeholder="Ex: mailane ou nicholas"
            icon="i-lucide-user-plus"
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
        <div class="text-center text-xs text-neutral-500">
          <NuxtLink to="/login" class="text-neutral-400 hover:text-white underline">
            Voltar para o login
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
