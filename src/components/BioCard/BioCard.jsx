import { Link } from 'react-router-dom'

export default function BioCard({ profile }) {
  const { username, bio, subscription_tier: tier } = profile
  const initial = Array.from(username.trim())[0]?.toLocaleUpperCase()
  return (
    <article className="space-y-3 rounded-xl border border-plain-border bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-plain-paper text-xl font-bold text-plain-teal">{initial}</div>
        <h1 className="break-all">{username}</h1>
        {tier !== 'free' && (
          <span className="rounded-full bg-plain-paper px-3 py-1 text-sm font-semibold text-plain-teal">
            {tier === 'org' ? 'Organization' : 'Pro'}
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap break-words">{bio || 'Add a short bio in settings.'}</p>
      <Link className="inline-block underline" to="/settings">Edit profile</Link>
    </article>
  )
}
