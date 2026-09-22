<template>
  <div class="min-h-screen grid place-items-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
          <UIcon name="i-lucide-link-2" class="size-6 text-indigo-300" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-white">{{ appName }}</h1>
        <p class="mt-1 text-sm text-slate-400">Shorten links. Share anywhere. Track clicks.</p>
      </div>
      <slot />
      <p class="mt-6 text-center text-xs text-slate-500">
        API: {{ apiBase }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const appName = (config.public.appName as string) || 'SnipLink'
</script>
