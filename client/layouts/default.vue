<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
    <AppHeader />
    <main class="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-16">
      <slot />
    </main>
    <footer class="border-t border-white/5 py-6 text-center text-xs text-slate-500">
      SnipLink · Nuxt UI + Express · API {{ apiBase }}
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
</script>
