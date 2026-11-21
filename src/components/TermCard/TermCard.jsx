export default function TermCard({ term }) {
  return (
    <article className="term-card">
      <p className="category">{term.category}</p>
      <h2>{term.jargon}</h2>
      <p>{term.translation}</p>
      {term.analogy && <p><strong>Example</strong> {term.analogy}</p>}
    </article>
  )
}
