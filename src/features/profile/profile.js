import { getSupabase } from '../../lib/supabase'

const columns = 'id, username, bio, subscription_tier, is_pro, org_id'

export async function readProfile(id, signal) {
  const { data, error } = await getSupabase().from('profiles').select(columns)
    .eq('id', id).abortSignal(signal).single()
  if (error) throw error
  return data
}

export async function saveProfile(id, fields) {
  const { error } = await getSupabase().from('profiles').update(fields).eq('id', id).select('id').single()
  if (error) throw error
}
