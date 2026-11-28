import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = url && key ? createClient(url, key) : null

export function getSupabase() {
  if (!supabase) throw new Error('PlainSpeak has not been connected to Supabase yet.')
  return supabase
}
