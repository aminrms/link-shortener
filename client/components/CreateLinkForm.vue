<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-sparkles" class="size-5 text-indigo-400" />
        <h2 class="font-semibold">Create a short link</h2>
      </div>
    </template>

    <UForm :state="state" :validate="validate" class="flex flex-col sm:flex-row gap-3" @submit.prevent="onSubmit">
      <UInput
        v-model="state.url"
        placeholder="https://example.com/very/long/url…"
        icon="i-lucide-globe"
        size="lg"
        class="flex-1"
        :disabled="loading"
      />
      <UButton type="submit" size="lg" icon="i-lucide-scissors" :loading="loading">
        Shorten
      </UButton>
    </UForm>

    <p v-if="formError" class="mt-3 text-sm text-red-400">{{ formError }}</p>
  </UCard>
</template>

<script setup lang="ts">
const emit = defineEmits<{ created: [] }>()
const { createLink } = useLinks()
const toast = useToast()

const state = reactive({ url: '' })
const loading = ref(false)
const formError = ref('')

function validate(s: typeof state) {
  const errors: { name: string; message: string }[] = []
  if (!s.url?.trim()) {
    errors.push({ name: 'url', message: 'URL is required' })
  } else {
    try {
      const u = new URL(s.url.trim())
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error()
    } catch {
      errors.push({ name: 'url', message: 'Enter a valid http(s) URL' })
    }
  }
  return errors
}

async function onSubmit() {
  formError.value = ''
  loading.value = true
  try {
    const link = await createLink(state.url.trim())
    state.url = ''
    toast.add({ title: 'Link shortened', description: link.short_link || link.short_code, icon: 'i-lucide-check', color: 'success' })
    emit('created')
  } catch (e: any) {
    formError.value = e?.data?.message || e?.message || 'Could not create link'
  } finally {
    loading.value = false
  }
}
</script>
