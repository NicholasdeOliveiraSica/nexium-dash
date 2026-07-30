export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Redirecionamento da rota raiz '/'
  if (to.path === '/') {
    if (user.value) {
      return navigateTo('/dash')
    }
    return navigateTo('/login')
  }

  // Se o usuário estiver autenticado e tentar acessar login/register
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dash')
  }

  // Se não estiver autenticado e tentar acessar rotas protegidas
  if (!user.value && to.path.startsWith('/dash')) {
    return navigateTo('/login')
  }
})
