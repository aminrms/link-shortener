/**
 * Thin wrapper around $fetch wired to the Express server.
 * Base URL comes from runtimeConfig.public.apiBase (NUXT_PUBLIC_API_BASE),
 * which must point at the server PORT (default http://localhost:4000).
 */
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuth()

  const baseURL = config.public.apiBase as string

  const client = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = auth.token.value
      if (token) {
        options.headers = new Headers(options.headers || {})
        ;(options.headers as Headers).set('Authorization', `Bearer ${token}`)
      }
    },
    onResponseError({ response }) {
      // Auto-logout on expired/invalid token (server returns 401 with
      // "invalid or expired token" from auth.middleware.ts)
      if (response?.status === 401 && auth.token.value) {
        auth.logout()
      }
    }
  })

  return { client, baseURL }
}
