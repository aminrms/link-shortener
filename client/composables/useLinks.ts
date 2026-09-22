import type { LinkItem } from '~/types'

interface ListResponse {
  data: { results: LinkItem[] }
}

export function useLinks() {
  const { client } = useApi()

  const links = useState<LinkItem[]>('links', () => [])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchLinks() {
    pending.value = true
    error.value = null
    try {
      // GET /api/links -> { data: { results } }
      const res = await client<ListResponse>('/api/links')
      links.value = res.data.results
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to load links'
    } finally {
      pending.value = false
    }
  }

  async function createLink(originalUrl: string) {
    // POST /api/links { original_url } -> Link
    const link = await client<LinkItem>('/api/links', {
      method: 'POST',
      body: { original_url: originalUrl }
    })
    links.value = [link, ...links.value]
    return link
  }

  async function deleteLink(id: number) {
    // DELETE /api/links/:id
    await client(`/api/links/${id}`, { method: 'DELETE' })
    links.value = links.value.filter(l => l.id !== id)
  }

  return { links, pending, error, fetchLinks, createLink, deleteLink }
}
