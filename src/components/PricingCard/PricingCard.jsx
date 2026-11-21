export default function PricingCard({ title, price, features, featured, children }) {
  return (
    <article className={`flex flex-col gap-4 rounded-xl border p-5 ${featured
      ? 'border-plain-teal bg-plain-paper'
      : 'border-plain-border bg-white'}`}>
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-lg font-semibold">{price}</p>
      </div>
      <ul className="ml-5 flex-1 list-disc space-y-1">
        {features.map(feature => <li key={feature}>{feature}</li>)}
      </ul>
      {children}
    </article>
  )
}
