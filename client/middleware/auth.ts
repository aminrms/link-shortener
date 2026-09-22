// Redirects guests to /login, keeps session across reloads via useAuth storage.
// NOTE: the token lives in localStorage (client-only), so the check must run
// on the client. On the server we skip: otherwise every refresh would be
// wrongly redirected to /login before hydration restores the session.
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const auth = useAuth()
  auth.initFromStorage()
  if (!auth.isLoggedIn.value) {
    return navigateTo('/login')
  }
})
