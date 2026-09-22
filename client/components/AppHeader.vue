<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span class="grid size-9 place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
          <UIcon name="i-lucide-link-2" class="size-5 text-indigo-300" />
        </span>
        <span class="text-lg font-bold tracking-tight">{{ appName }}</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <template v-if="isLoggedIn">
          <span class="hidden sm:inline-flex max-w-52 truncate text-sm text-slate-400">{{ user?.email }}</span>
          <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" @click="onLogout">
            Logout
          </UButton>
        </template>
        <template v-else>
          <UButton to="/login" color="neutral" variant="ghost">Log in</UButton>
          <UButton to="/register" icon="i-lucide-user-plus">Sign up</UButton>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuth()
auth.initFromStorage()
const { user, isLoggedIn } = auth
const config = useRuntimeConfig()
const appName = (config.public.appName as string) || 'SnipLink'

function onLogout() {
  auth.logout()
}
</script>
