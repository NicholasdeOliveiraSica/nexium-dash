/**
 * Converte um nome de usuário (ex: "mailane" ou "nicholas") em um formato de e-mail válido para o Supabase Auth.
 * Se o usuário digitar um e-mail completo com '@', mantém o e-mail digitado.
 * Caso contrário, utiliza o alias do Gmail contato.nexium.studio+<login>@gmail.com.
 */
export function normalizeLoginToEmail(login: string): string {
  const trimmed = login.trim().toLowerCase()
  if (trimmed.includes('@')) {
    return trimmed
  }
  return `contato.nexium.studio+${trimmed}@gmail.com`
}
