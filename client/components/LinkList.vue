<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list" class="size-5 text-slate-400" />
          <h2 class="font-semibold">Your links</h2>
          <UBadge color="neutral" variant="soft">{{ filtered.length }}</UBadge>
        </div>
        <UInput v-model="q" placeholder="Search URLs…" icon="i-lucide-search" size="sm" class="sm:w-64" />
      </div>
    </template>

    <div v-if="pending" class="space-y-3 p-6">
      <USkeleton v-for="i in 3" :key="i" class="h-20 w-full" />
    </div>

    <div v-else-if="filtered.length === 0" class="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span class="grid size-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
        <UIcon name="i-lucide-link-2-off" class="size-6 text-slate-500" />
      </span>
      <p class="font-medium">No links yet</p>
      <p class="text-sm text-slate-400">Shorten your first URL above to see it here.</p>
    </div>

    <ul v-else class="divide-y divide-white/5">
      <li v-for="link in filtered" :key="link.id" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <a :href="displayShort(link)" target="_blank" rel="noopener" class="font-mono text-sm font-semibold text-indigo-300 hover:text-indigo-200 hover:underline">
              {{ shortLabel(link) }}
            </a>
            <UBadge color="success" variant="soft" class="gap-1">
              <UIcon name="i-lucide-mouse-pointer-click" class="size-3" />
              {{ link.clicks }} clicks
            </UBadge>
          </div>
          <p class="mt-1 truncate text-sm text-slate-400" :title="link.original_url">{{ link.original_url }}</p>
          <p class="mt-0.5 text-xs text-slate-500">{{ formatDate(link.created_at) }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <UTooltip text="Copy short link">
            <UButton icon="i-lucide-copy" color="neutral" variant="ghost" size="sm" @click="copy(link)" />
          </UTooltip>
          <UTooltip text="Open original">
            <UButton icon="i-lucide-external-link" color="neutral" variant="ghost" size="sm" :to="link.original_url" target="_blank" />
          </UTooltip>
          <UTooltip text="Visit short link">
            <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="sm" :to="displayShort(link)" target="_blank" />
          </UTooltip>
          <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" :loading="deletingId === link.id" @click="remove(link.id)" />
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { LinkItem } from '~/types'

const props = defineProps<{ links: LinkItem[]; pending: boolean }>()
const emit = defineEmits<{ deleted: [] }>()

const config = useRuntimeConfig()
const toast = useToast()
const { deleteLink } = useLinks()

const q = ref('')
const deletingId = ref<number | null>(null)

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return props.links
  return props.links.filter(l =>
    l.original_url.toLowerCase().includes(needle) ||
    l.short_code.toLowerCase().includes(needle)
  )
})

function displayShort(link: LinkItem) {
  // Server returns absolute short_link built from request origin.
  if (link.short_link) return link.short_link
  const base = (config.public.shortBase as string).replace(/\/$/, '')
  return `${base}/${link.short_code}`
}

function shortLabel(link: LinkItem) {
  return displayShort(link).replace(/^https?:\/\//, '')
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

async function copy(link: LinkItem) {
  try {
    await navigator.clipboard.writeText(displayShort(link))
    toast.add({ title: 'Copied to clipboard', icon: 'i-lucide-check', color: 'success' })
  } catch {
    toast.add({ title: 'Copy failed', color: 'error', icon: 'i-lucide-x' })
  }
}

async function remove(id: number) {
  deletingId.value = id
  try {
    await deleteLink(id)
    toast.add({ title: 'Link deleted', icon: 'i-lucide-trash-2', color: 'neutral' })
    emit('deleted')
  } catch (e: any) {
    toast.add({ title: 'Delete failed', description: e?.data?.message || e?.message, color: 'error', icon: 'i-lucide-x' })
  } finally {
    deletingId.value = null
  }
}
</script>
