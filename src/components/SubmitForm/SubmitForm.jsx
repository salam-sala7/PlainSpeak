import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/authContext'
import { categories } from '../../features/terms/terms'
import { getSupabase } from '../../lib/supabase'

export default function SubmitForm() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (pending) return
    const entries = new FormData(event.currentTarget)
    const term = Object.fromEntries([...entries].map(([name, value]) => [name, value.trim()]))
    if (!term.jargon || !term.translation || !categories.includes(term.category)) {
      setError('Enter a term, a plain-language meaning and a category.')
      return
    }
    if (!session) {
      setError('Log in to submit a term.')
      return
    }

    setPending(true)
    setError('')
    try {
      const { error: insertError } = await getSupabase().from('terms').insert({ ...term, user_id: session.user.id })
      if (insertError) throw insertError
      navigate('/', { state: { notice: 'Term submitted.' } })
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <label>Legal term<textarea name="jargon" rows={2} maxLength={160} required /></label>
      <label>Plain-language meaning<textarea name="translation" maxLength={1500} required /></label>
      <label>Example or analogy<textarea name="analogy" maxLength={1500} /></label>
      <label>Category<select name="category" defaultValue="" required>
        <option value="" disabled>Choose a category</option>
        {categories.map(category => <option key={category}>{category}</option>)}
      </select></label>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending}>{pending ? 'Submitting…' : 'Submit term'}</button>
    </form>
  )
}
