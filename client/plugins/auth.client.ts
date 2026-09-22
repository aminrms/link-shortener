// Restores the session from localStorage as soon as the client app starts,
// so the token/user state is ready before any middleware or page renders.
export default defineNuxtPlugin(() => {
  const auth = useAuth()
  auth.initFromStorage()
})
