<template>
  <div class="space-y-6 py-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-slate-400">Welcome back<template v-if="user">, <span class="text-slate-200">{{ user.email }}</span></template>. Manage all your short links here.</p>
    </div>

    <StatsCards :links="links" />
    <CreateLinkForm @created="refresh" />
    <LinkList :links="links" :pending="pending" @deleted="refresh" />

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-triangle-alert"
      :title="error"
      :actions="[{ label: 'Retry', click: refresh }]"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

const auth = useAuth()
const { user } = auth
const { links, pending, error, fetchLinks } = useLinks()

async function refresh() {
  await fetchLinks()
}

onMounted(() => {
  refresh()
})
</script>
