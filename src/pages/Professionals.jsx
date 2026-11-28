import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookingModal from '../components/BookingModal/BookingModal'
import { useAuth } from '../features/auth/authContext'
import { fetchProfessionals } from '../features/consultations/consultations'

export default function Professionals() {
  const { session, loading } = useAuth()
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const request = new AbortController()
    fetchProfessionals(request.signal).then(
      people => {
        if (!request.signal.aborted) setResult({ people })
      },
      error => {
        if (!request.signal.aborted) setResult({ error: error.message })
      }
    )
    return () => request.abort()
  }, [])

  return (
    <section>
      <h1>Professional directory</h1>
      {!result && <p role="status">Loading the directory…</p>}
      {result?.error && <p role="alert">{result.error}</p>}
      {result?.people?.length === 0 && <p>No listings yet.</p>}
      {notice && <p role="status">{notice}</p>}
      <div className="term-grid">
        {result?.people?.map(person => <article key={person.id} className="term-card">
          <h2>{person.name}</h2>
          <p>{person.specialty}{person.is_demo ? ' · Demo listing' : ''}</p>
          {!loading && (session
            ? <button onClick={() => { setNotice(''); setSelected(person) }}>Request consultation</button>
            : <Link to="/login" state={{ from: '/professionals' }}>Log in to request</Link>)}
        </article>)}
      </div>
      {selected && session && <BookingModal professional={selected} clientId={session.user.id}
        onClose={() => setSelected(null)} onBooked={message => { setSelected(null); setNotice(message) }} />}
    </section>
  )
}
