import { Link } from 'react-router-dom'

export default function ProCard({ person, canBook, authLoading, onBook }) {
  return (
    <article className="grid gap-3 rounded-xl border border-plain-border bg-white p-4">
      <div>
        <h2 className="text-xl font-bold">{person.name}</h2>
        <p>{person.specialty}{person.is_demo ? ' · Demo listing' : ''}</p>
      </div>
      <p className="font-semibold">{person.is_demo ? 'Free demo' : 'Rate on request'}</p>
      {!authLoading && (canBook
        ? <button type="button" onClick={onBook}>Request consultation</button>
        : <Link className="w-fit underline" to="/login" state={{ from: '/professionals' }}>Log in to request</Link>)}
    </article>
  )
}
