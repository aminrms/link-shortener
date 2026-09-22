<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">Welcome back</h2>
      <p class="mt-0.5 text-sm text-slate-400">Log in to manage your links.</p>
    </template>

    <UForm :state="state" :validate="validate" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" autocomplete="email" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-lucide-lock" class="w-full" autocomplete="current-password" />
      </UFormField>

      <UAlert v-if="formError" color="error" variant="soft" icon="i-lucide-triangle-alert" :title="formError" />

      <UButton type="submit" block size="lg" icon="i-lucide-log-in" :loading="loading">
        Log in
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-slate-400">
        No account yet?
        <NuxtLink to="/register" class="font-medium text-indigo-300 hover:text-indigo-200 hover:underline">Create one</NuxtLink>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuth()
const router = useRouter()
const toast = useToast()

const state = reactive({ email: '', password: '' })
const loading = ref(false)
const formError = ref('')

function validate(s: typeof state) {
  const errors: { name: string; message: string }[] = []
  if (!s.email?.trim()) errors.push({ name: 'email', message: 'Email is required' })
  else if (!/^\S+@\S+\.\S+$/.test(s.email)) errors.push({ name: 'email', message: 'Enter a valid email' })
  if (!s.password) errors.push({ name: 'password', message: 'Password is required' })
  return errors
}

async function onSubmit() {
  formError.value = ''
  loading.value = true
  try {
    // POST /api/auth/login — server returns { data: { user, access_token } }
    await auth.login(state.email.trim(), state.password)
    toast.add({ title: 'Welcome back!', icon: 'i-lucide-check', color: 'success' })
    router.push('/')
  } catch (e: any) {
    formError.value = e?.data?.message || e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
