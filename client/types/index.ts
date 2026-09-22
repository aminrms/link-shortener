export interface ApiUser {
  id: number
  email: string
  created_at?: string
}

export interface LinkItem {
  id: number
  user_id: number
  original_url: string
  short_code: string
  short_link: string | null
  clicks: number
  expires_at: string | null
  created_at: string
  updated_at: string
}
