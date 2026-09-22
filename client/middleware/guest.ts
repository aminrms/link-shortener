// Redirects logged-in users away from login/register to the dashboard.
// Client-only check: localStorage is unreadable during SSR.
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const auth = useAuth()
  auth.initFromStorage()
  if (auth.isLoggedIn.value) {
    return navigateTo('/')
  }
})
