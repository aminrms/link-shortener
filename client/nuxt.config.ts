// Nuxt config — wired to the Express server in ../server
// Server endpoints used:
//   POST /api/auth/register { email, password } -> { data: { user, access_token } }
//   POST /api/auth/login    { email, password } -> { data: { user, access_token } }
//   GET    /api/links                           -> { data: { results: Link[] } }
//   POST   /api/links { original_url }          -> Link
//   DELETE /api/links/:id                       -> { message: "Deleted" }
//   GET    /:sc                                 -> 302 redirect (server root)
//   GET    /api/health                          -> { messsage: "ok" }
// Server config mirrored: PORT (default 4000), CORS open, helmet on.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // server-only (unused on client, kept for completeness)
    apiSecret: '',
    public: {
      // Base URL of the Express API, e.g. http://localhost:4000
      // NUXT_PUBLIC_API_BASE=http://localhost:4000
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
      // Base URL used to build/display short links (server origin).
      // Usually identical to apiBase since redirect lives at GET /:sc.
      shortBase: process.env.NUXT_PUBLIC_SHORT_BASE || 'http://localhost:4000',
      appName: 'SnipLink'
    }
  },

  app: {
    head: {
      title: 'SnipLink — Shorten links beautifully',
      meta: [
        { name: 'description', content: 'A minimal, fast link shortener with analytics.' }
      ]
    }
  },

  ssr: true,

  // Pinned so it never collides with sibling projects (e.g. amsn.ir on :3000).
  // A stale service worker / HMR socket from another localhost origin will
  // otherwise serve foreign chunks ("/features/*", "/shared/*") into this app.
  devServer: {
    port: 3001
  },

  typescript: {
    strict: true
  }
})
