import { getSupabase } from '../../lib/supabase'

export const termColumns = 'id, jargon, translation, analogy, category, trust_score'

export async function readTerm(id, signal) {
  const { data, error } = await getSupabase().from('terms').select(termColumns)
    .eq('id', id).abortSignal(signal).maybeSingle()
  if (error) throw error
  return data
}

export async function readUserTerms(userId, signal) {
  const { data, error } = await getSupabase().from('terms').select(termColumns)
    .eq('user_id', userId).order('created_at', { ascending: false }).order('id').abortSignal(signal)
  if (error) throw error
  return data
}

export const categories = ['Contracts', 'Privacy', 'Employment', 'Housing']

export function filterTerms(terms, search, category) {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return terms.filter(term => {
    const text = [term.jargon, term.translation, term.analogy, term.category].join(' ').toLowerCase()
    return (!category || term.category === category) && words.every(word => text.includes(word))
  })
}
