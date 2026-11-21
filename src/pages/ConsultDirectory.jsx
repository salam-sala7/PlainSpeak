import { useEffect, useState } from 'react'
import BookingModal from '../components/BookingModal/BookingModal'
import ProCard from '../components/ProCard/ProCard'
import { useAuth } from '../features/auth/authContext'
import { fetchProfessionals } from '../features/consultations/consultations'

export default function ConsultDirectory() {
  const { session, loading } = useAuth()
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')

  useEffect(() => {
    const request = new AbortController()
    fetchProfessionals(request.signal).then(
      people => {
        if (!request.signal.aborted) setResult({ people })
      },
      error => {
        if (!request.signal.aborted) setResult({ error: error.message })
      },
    )
    return () => request.abort()
  }, [])

  const people = result?.people ?? []
  const specialties = [...new Set(people.map(person => person.specialty))].sort()
  const query = search.trim().toLowerCase()
  const listing = people.filter(person =>
    (!specialty || specialty === person.specialty) &&
    `${person.name} ${person.specialty}`.toLowerCase().includes(query),
  )

  return (
    <section className="space-y-4">
      <h1>Professional directory</h1>
      {people.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2" role="search" aria-label="Search professionals">
          <label>Search professionals
            <input type="search" value={search} onChange={event => setSearch(event.target.value)} />
          </label>
          <label>Specialty
            <select value={specialty} onChange={event => setSpecialty(event.target.value)}>
              <option value="">All specialties</option>
              {specialties.map(name => <option key={name}>{name}</option>)}
            </select>
          </label>
        </div>
      )}
      {!result && <p role="status">Loading the directory…</p>}
      {result?.error && <p role="alert">{result.error}</p>}
      {result?.people && listing.length === 0 && (
        <p role="status">{people.length ? 'No professionals match your search.' : 'No listings yet.'}</p>
      )}
      {notice && <p role="status">{notice}</p>}
      <div className="term-grid">
        {listing.map(person => (
          <ProCard key={person.id} person={person} canBook={Boolean(session)} authLoading={loading}
            onBook={() => { setNotice(''); setSelected(person) }} />
        ))}
      </div>
      {selected && session && <BookingModal professional={selected} clientId={session.user.id}
        onClose={() => setSelected(null)} onBooked={message => { setSelected(null); setNotice(message) }} />}
    </section>
  )
}
