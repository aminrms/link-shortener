<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">Create your account</h2>
      <p class="mt-0.5 text-sm text-slate-400">Free forever. No credit card needed.</p>
    </template>

    <UForm :state="state" :validate="validate" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" autocomplete="email" />
      </UFormField>

      <UFormField label="Password" name="password" required hint="Min. 6 characters">
        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-lucide-lock" class="w-full" autocomplete="new-password" />
      </UFormField>

      <UFormField label="Confirm password" name="confirm" required>
        <UInput v-model="state.confirm" type="password" placeholder="••••••••" icon="i-lucide-lock-keyhole" class="w-full" autocomplete="new-password" />
      </UFormField>

      <UAlert v-if="formError" color="error" variant="soft" icon="i-lucide-triangle-alert" :title="formError" />

      <UButton type="submit" block size="lg" icon="i-lucide-user-plus" :loading="loading">
        Sign up
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-slate-400">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-indigo-300 hover:text-indigo-200 hover:underline">Log in</NuxtLink>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuth()
const router = useRouter()
const toast = useToast()

const state = reactive({ email: '', password: '', confirm: '' })
const loading = ref(false)
const formError = ref('')

function validate(s: typeof state) {
  const errors: { name: string; message: string }[] = []
  if (!s.email?.trim()) errors.push({ name: 'email', message: 'Email is required' })
  else if (!/^\S+@\S+\.\S+$/.test(s.email)) errors.push({ name: 'email', message: 'Enter a valid email' })
  if (!s.password) errors.push({ name: 'password', message: 'Password is required' })
  else if (s.password.length < 6) errors.push({ name: 'password', message: 'Min. 6 characters' })
  if (s.confirm !== s.password) errors.push({ name: 'confirm', message: 'Passwords do not match' })
  return errors
}

async function onSubmit() {
  formError.value = ''
  loading.value = true
  try {
    // POST /api/auth/register — server returns { data: { user, access_token } }
    await auth.register(state.email.trim(), state.password)
    toast.add({ title: 'Account created!', icon: 'i-lucide-party-popper', color: 'success' })
    router.push('/')
  } catch (e: any) {
    formError.value = e?.data?.message || e?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
