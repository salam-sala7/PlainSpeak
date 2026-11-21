import { getSupabase } from '../../lib/supabase'

export async function fetchProfessionals(signal) {
  const { data, error } = await getSupabase().from('professionals')
    .select('id, name, specialty, is_demo').order('name').abortSignal(signal)
  if (error) throw error
  return data
}

const maxDocumentBytes = 1024 * 1024
const hexBytes = Array.from({ length: 256 }, (_, n) => n.toString(16).padStart(2, '0'))

async function documentFields(file) {
  if (!file?.name) return {}
  if (!file.name.toLowerCase().endsWith('.pdf') || file.size > maxDocumentBytes || file.name.length > 255) {
    throw new Error('Choose a PDF document up to 1 MB with a filename of 255 characters or fewer.')
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') {
    throw new Error('Choose a valid PDF document.')
  }

  const chunks = []
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    const chunk = bytes.subarray(offset, offset + 8192)
    chunks.push(Array.from(chunk, byte => hexBytes[byte]).join(''))
  }
  return { document_name: file.name, document_pdf: '\\x' + chunks.join('') }
}

export async function bookConsultation(clientId, proId, date, file) {
  const attachment = await documentFields(file)
  const { error } = await getSupabase().from('consultations')
    .insert({ client_id: clientId, pro_id: proId, date, ...attachment })
  if (error?.code === '23505') throw new Error('You already requested this time.')
  if (error) throw error
}
