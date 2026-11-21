import { getSupabase } from '../../lib/supabase'

export async function fetchProfessionals(signal) {
  const { data, error } = await getSupabase().from('professionals')
    .select('id, name, specialty, is_demo').order('name').abortSignal(signal)
  if (error) throw error
  return data
}

export async function bookConsultation(clientId, proId, date) {
  const { error } = await getSupabase().from('consultations')
    .insert({ client_id: clientId, pro_id: proId, date })
  if (error?.code === '23505') throw new Error('You already requested this time.')
  if (error) throw error
}
