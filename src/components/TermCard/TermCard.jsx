import { Link } from 'react-router-dom'

const verifiedTrustScore = 5

export default function TermCard({ term, detail = false }) {
  return (
    <article className="min-w-0 space-y-3 break-words rounded-xl border border-plain-border bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="category">{term.category}</p>
        {term.trust_score >= verifiedTrustScore && (
          <span className="rounded-full bg-plain-paper px-2 py-1 text-sm font-semibold text-plain-teal">Verified Clear</span>
        )}
      </div>
      {detail ? <h1>{term.jargon}</h1> : (
        <h2 className="term-title text-xl font-bold"><Link to={`/terms/${term.id}`}>{term.jargon}</Link></h2>
      )}
      <p>{term.translation}</p>
      {term.analogy && <p><strong>Example</strong> {term.analogy}</p>}
    </article>
  )
}
