import type { ApiUser } from '~/types'

interface AuthResponse {
  data: {
    user: ApiUser
    access_token: string
  }
  message: string
}

const TOKEN_KEY = 'sniplink_token'
const USER_KEY = 'sniplink_user'

export function useAuth() {
  const config = useRuntimeConfig()
  const router = useRouter()

  const token = useState<string | null>('auth_token', () => null)
  const user = useState<ApiUser | null>('auth_user', () => null)
  const initialized = useState<boolean>('auth_init', () => false)

  function initFromStorage() {
    if (initialized.value) return
    // Tokens live in localStorage, which only exists in the browser.
    // Must NOT mark initialized on the server, or the client will skip
    // reading storage after hydration and the user will look logged out.
    if (import.meta.server) return
    initialized.value = true
    try {
      const t = localStorage.getItem(TOKEN_KEY)
      const u = localStorage.getItem(USER_KEY)
      if (t) token.value = t
      if (u) user.value = JSON.parse(u)
    } catch {
      // corrupted storage — clear it
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  function persist(t: string, u: ApiUser) {
    token.value = t
    user.value = u
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, t)
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    }
  }

  const isLoggedIn = computed(() => !!token.value)

  const apiBase = () => config.public.apiBase as string

  async function register(email: string, password: string) {
    // POST /api/auth/register { email, password }
    const res = await $fetch<AuthResponse>(`${apiBase()}/api/auth/register`, {
      method: 'POST',
      body: { email, password }
    })
    persist(res.data.access_token, res.data.user)
    return res.data
  }

  async function login(email: string, password: string) {
    // POST /api/auth/login { email, password }
    const res = await $fetch<AuthResponse>(`${apiBase()}/api/auth/login`, {
      method: 'POST',
      body: { email, password }
    })
    persist(res.data.access_token, res.data.user)
    return res.data
  }

  function logout(redirect = true) {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    if (redirect) router.push('/login')
  }

  return { token, user, isLoggedIn, initialized, initFromStorage, register, login, logout }
}
