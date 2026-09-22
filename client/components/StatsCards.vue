<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">Total links</p>
          <p class="mt-1 text-3xl font-bold">{{ links.length }}</p>
        </div>
        <span class="grid size-11 place-items-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
          <UIcon name="i-lucide-link" class="size-5 text-indigo-300" />
        </span>
      </div>
    </UCard>
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">Total clicks</p>
          <p class="mt-1 text-3xl font-bold">{{ totalClicks }}</p>
        </div>
        <span class="grid size-11 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/20">
          <UIcon name="i-lucide-mouse-pointer-click" class="size-5 text-emerald-300" />
        </span>
      </div>
    </UCard>
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">Avg. clicks / link</p>
          <p class="mt-1 text-3xl font-bold">{{ avgClicks }}</p>
        </div>
        <span class="grid size-11 place-items-center rounded-xl bg-amber-500/15 ring-1 ring-amber-400/20">
          <UIcon name="i-lucide-chart-column" class="size-5 text-amber-300" />
        </span>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { LinkItem } from '~/types'

const props = defineProps<{ links: LinkItem[] }>()
const totalClicks = computed(() => props.links.reduce((s, l) => s + (l.clicks || 0), 0))
const avgClicks = computed(() => props.links.length ? (totalClicks.value / props.links.length).toFixed(1) : '0')
</script>
