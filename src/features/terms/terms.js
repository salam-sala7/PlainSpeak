export const categories = ['Contracts', 'Privacy', 'Employment', 'Housing']

export function filterTerms(terms, search, category) {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return terms.filter(term => {
    const text = [term.jargon, term.translation, term.analogy, term.category].join(' ').toLowerCase()
    return (!category || term.category === category) && words.every(word => text.includes(word))
  })
}
