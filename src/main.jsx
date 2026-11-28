import {useMessageNotifications,messageLabels} from './useMessageNotifications'
import {Avatar} from './FeedPost'
import ConsultationChat, {PhotoSettings,chatWords} from './ConsultationChat'
import {UsersRound,MessageCircle} from 'lucide-react'
import TermActions from './TermActions'
import {BusinessPlans,ProviderPanel,DeleteAccount,commerceWords} from './Commerce'
import {SignupFields, AccountCommunity, words} from './AccountCommunity'
import { prioritize, prioritizeTerms, activePromotion } from './feedPriority'
import { localSpecialty, experienceLabel, localDate } from './professionalLocalization'
import { useTranslation } from 'react-i18next'
import { Preferences, SettingsProvider } from './Preferences.jsx'
import AccessibilityStatement from './AccessibilityStatement.jsx'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Briefcase, CalendarDays, FileText, House, Plus, Search, Shield, Sparkles, X, UserRound, Compass, Crown, Settings } from 'lucide-react'
import { BrowserRouter, HashRouter, Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams, useOutletContext } from 'react-router-dom'
import * as api from './services'
import { BackButton } from './CommunityExtras'
import Community from './Community.jsx'
import './style.css'
import './preferences.css'
import './site-navigation.css'

const categoryIcons = { Contracts: FileText, Employment: Briefcase, Housing: House, Privacy: Shield }
const plans = [
  { id: 'free', title: 'Free', price: '0', description: 'For readers and community contributors.', features: ['Browse the glossary', 'Publish explanations', 'Request consultations'] },
  { id: 'pro', title: 'Pro', price: '15', description: 'For independent professionals.', features: ['Everything in Free', 'Professional plan preview'] },
  { id: 'org', title: 'Organization', price: '49', description: 'For teams and practices.', features: ['Everything in Pro', 'Organization plan preview'] },
]

function useRequest(load, key = '') {
  const [result, setResult] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => load(controller.signal, key)).then(
      data => { if (!controller.signal.aborted) setResult({ load, key, data }) },
      failure => { if (!controller.signal.aborted) setResult({ load, key, error: failure.message }) },
    )
    return () => controller.abort()
  }, [load, key])
  return result?.load === load && result.key === key ? result : null
}

function Layout({ session }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const notifications=useMessageNotifications(session?.user.id)
  const ml=messageLabels[i18n.resolvedLanguage]||messageLabels.en
  const account = session ? '/community/'+session.user.id : '/login'
  const activeCommunity = location.pathname === '/' || location.pathname === '/community'
  return <>
    <a className="skip" href="#content" onClick={event => {
      event.preventDefault()
      document.getElementById('content').focus()
    }}>{t("Skip to content")}</a>
    <header className="header ps-site-header">
      <div className="shell nav">
        <Link to="/" className="brand"><span><BookOpen size={21} /></span>PlainSpeak<span className="brand-dot">.</span></Link>
        <div className="nav-actions"><Preferences />
          <NavLink className="ps-header-account" to={account} aria-label={session ? t('My profile') : t('Log in')} title={session ? t('My profile') : t('Log in')}><UserRound size={21} aria-hidden="true" /></NavLink>
        </div>
      </div>
    </header>
    <div className="ps-site-layout">
      <aside className="ps-site-sidebar">
        <nav aria-label={t("Main navigation")} className="ps-site-links">
          <Link to="/" aria-current={activeCommunity?'page':undefined} className={activeCommunity?'active':''}><House aria-hidden="true"/>{t("Community")}</Link>
          <NavLink to="/terms"><Compass aria-hidden="true"/>{t("Explore")}</NavLink>
          <NavLink to="/professionals"><UsersRound aria-hidden="true"/>{t("Professionals")}</NavLink>
          <NavLink to="/plans"><Crown aria-hidden="true"/>{t("Plans")}</NavLink>
          <Link to="/?compose=1" className="ps-site-compose"><Plus aria-hidden="true"/>{words(i18n.resolvedLanguage).newPost}</Link>
          <NavLink to="/submit"><FileText aria-hidden="true"/>{t("Share an explanation")}</NavLink>
          {session&&<NavLink to="/messages"><MessageCircle aria-hidden="true"/>{chatWords(i18n.resolvedLanguage)[0]}{notifications.total>0&&<span className="ps-unread" aria-label={notifications.total+' '+ml.unread}>{notifications.total>99?'99+':notifications.total}</span>}</NavLink>}{session&&<NavLink to="/settings"><Settings aria-hidden="true"/>{t('Settings')}</NavLink>}
        </nav>
      </aside>
      <main className="shell ps-site-content" id="content" tabIndex={-1}>{!activeCommunity&&<BackButton />}<Outlet context={notifications}/></main>
    </div>
    {session&&notifications.toast&&location.pathname!=='/messages'&&<div className="ps-message-toast" role="status"><strong>{ml.new}</strong><Link to="/messages" onClick={notifications.dismiss}>{ml.open}</Link><button type="button" aria-label={ml.close} onClick={notifications.dismiss}>×</button></div>}
    <footer className="shell footer"><Link to="/" className="brand"><BookOpen size={18} /> PlainSpeak.</Link><span>{api.demo ? t('Interactive demo · Changes are stored in this browser') : t('Community explanations and consultations')}</span><Link to="/accessibility">{t('Accessibility statement')}</Link></footer>
  </>
}

function Protected({ session, loading }) {
  const context=useOutletContext()
  const { t, i18n } = useTranslation()
  const { pathname, search } = useLocation()
  if (loading) return <p role="status">{t("Checking your session…")}</p>
  return session ? <Outlet context={context}/> : <Navigate to="/login" replace state={{ from: pathname + search }} />
}

function Notice({ children, error = false }) {
  return children && <p className={error ? 'notice error' : 'notice'} role={error ? 'alert' : 'status'}>{children}</p>
}

function Category({ name }) {
  const { t, i18n } = useTranslation()
  const Icon = categoryIcons[name] || BookOpen
  return <span className="category" data-category={name}><Icon size={14} aria-hidden="true" />{t(name)}</span>
}

function Author({ name, verified, isDemo, specialty, avatarPath }) {
  const { t, i18n } = useTranslation()
  
  return <div className="author"><Avatar person={{display_name:name||t("Community member"),avatar_path:avatarPath}}/><div>
    <strong><bdi>{name || t('Community member')}</bdi> {verified && <span role="img" title={isDemo ? t('Demo verification') : t('Verified professional')} aria-label={isDemo ? t('Demo verification') : t('Verified professional')}><BadgeCheck size={17} aria-hidden="true" /></span>}</strong>
    {specialty && <small>{localSpecialty(specialty, i18n.resolvedLanguage)}</small>}
  </div></div>
}

function TermCard({ term, userId, own, onChanged }) {
  const { t, i18n } = useTranslation()
  return <article className="card term-card">
    <div className="card-meta"><Category name={term.category} />{activePromotion(term,i18n.resolvedLanguage) && <span className="sponsored"><Sparkles size={13} /> {term.is_demo ? t('Sponsored demo') : t('Sponsored')}</span>}</div>
    <h3 dir="auto"><Link to={'/terms/' + term.id}>{term.jargon}</Link></h3>
    <p dir="auto">{term.translation}</p>
    {term.analogy && <div className="example"><strong>{t("Example")}</strong> {term.analogy}</div>}
    <div className="card-footer"><Author name={term.author_name} avatarPath={term.avatar_path} verified={term.author_verified} isDemo={term.is_demo} />
      <Link className="icon-link" to={'/terms/' + term.id} aria-label={t('Read') + ' ' + term.jargon}><ArrowUpRight size={19} /></Link></div>
    {own && <TermActions term={term} userId={userId} onChanged={onChanged}/>}
  </article>
}

function Explore({ session }) {
  const { t, i18n } = useTranslation()
  const [revision, refreshTerms] = useState(0)
  const userId = session?.user.id || ""
  const ownResult = useRequest(loadOwnTerms, userId+":"+revision)
  const result = useRequest(api.listTerms, revision)
  const [params, setParams] = useSearchParams()
  const search = params.get('q') || ''
  const category = params.get('category') || ''
  const [visible, setVisible] = useState(9)
  function filter(name, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setVisible(9)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const terms = prioritizeTerms((result?.data || []).filter(term =>
    (!category || term.category === category) && words.every(word =>
      [term.jargon, term.translation, term.analogy, term.author_name, term.category].join(' ').toLowerCase().includes(word))), i18n.resolvedLanguage)

  function browse() {
    const results = document.getElementById('results')
    results.focus({ preventScroll: true })
    results.scrollIntoView({ behavior: 'smooth' })
  }

  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span /> {t("THE COMMUNITY GLOSSARY")}</p>
        <h1>{t("Get the meaning.")}<br /><em>{t("Skip the jargon.")}</em></h1>
        <p>{t("Make sense of contracts, policies, and everyday documents with clear explanations and real-world examples.")}</p>
        <label className="hero-search"><Search size={22} /><input aria-label={t("Search terms")} type="search" value={search} onChange={event => filter('q', event.target.value)} onKeyDown={event => { if (event.key === 'Enter') browse() }} placeholder={t("Try “security deposit”")} /><button aria-label={t("View search results")} onClick={browse}><ArrowRight size={20} /></button></label>
      </div>
      <div className="illustration" aria-hidden="true">
        <div className="orbit"></div><div className="paper"><div className="paper-head"><FileText size={20} /> {t("RENTAL AGREEMENT")}</div><i></i><i></i><i></i><i></i></div>
        <div className="translation"><div><Sparkles size={16} /> {t("IN PLAIN LANGUAGE")}</div><strong>{t("Security deposit")}</strong><p>{t("Money held to cover certain costs that may arise during a rental.")}</p></div>
        <span className="illustration-spark"><Sparkles size={32} strokeWidth={1.4} /></span>
      </div>
    </section>
    <section className="results" id="results" tabIndex={-1}>
      <div className="section-head"><div><h2>{t("Explore terms")}</h2><p>{result?.data ? `${terms.length} ${terms.length === 1 ? t('explanation') : t('explanations')}` : t('Community explanations')}</p></div><Link className="button secondary" to="/submit"><Plus size={18} /> {t("Share an explanation")}</Link></div>
      <div className="filters" aria-label={t("Filter by category")}>
        <button className="filter" aria-pressed={!category} onClick={() => filter('category', '')}>{t("All topics")}</button>
        {api.categories.map(name => <button className="filter" key={name} aria-pressed={category === name} onClick={() => filter('category', name)}>{t(name)}</button>)}
      </div>
      {!result && <p role="status">{t("Loading terms…")}</p>}
      <Notice error>{result?.error}</Notice>
      {result?.data && !terms.length && <div className="card empty"><BookOpen size={26} /><h3>{search || category ? t('No matching terms') : t('No terms yet')}</h3>{(search || category) && <button className="button secondary" onClick={() => { setParams({}, { replace: true }); setVisible(9) }}>{t("Clear filters")}</button>}</div>}
      <div className="grid ps-terms-list">{terms.slice(0, visible).map(term => <TermCard key={term.id} term={term} userId={userId} own={!!userId && ownResult?.data?.includes(term.id)} onChanged={()=>refreshTerms(n=>n+1)} />)}</div>
      {terms.length > visible && <button className="button secondary load" onClick={() => setVisible(visible + 9)}>{t("Show more")} <ArrowDown size={17} /></button>}
    </section>
  </>
}

function loadOwnTerms(signal, key){return api.listOwnTermIds(key.split(":")[0], signal)}

function TermDetails({ session }) {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [revision, refreshTerm] = useState(0)
  const navigate = useNavigate()
  const userId = session?.user.id || ""
  const ownResult = useRequest(loadOwnTerms, userId+":"+revision)
  const result = useRequest(loadTerm, id+":"+revision)
  function details() {
    if (!result) return <p role="status">{t("Loading term…")}</p>
    if (result.error) return <Notice error>{result.error}</Notice>
    const term = result.data
    if (!term) return <h1>{t("Term not found")}</h1>
    return <article className="card detail">
      <div className="card-meta"><Category name={term.category} />{activePromotion(term,i18n.resolvedLanguage) && <span className="sponsored"><Sparkles size={14} /> {term.is_demo ? t('Sponsored demo') : t('Sponsored')}</span>}</div>
      <h1 dir="auto">{term.jargon}</h1><Author name={term.author_name} avatarPath={term.avatar_path} verified={term.author_verified} isDemo={term.is_demo} />
      <h2>{t("In plain language")}</h2><p dir="auto">{term.translation}</p>
      {term.analogy && <div className="example"><h2>{t("Example")}</h2><p dir="auto">{term.analogy}</p></div>}
      <Link className="button secondary" to={"/professionals?category="+encodeURIComponent(term.category)}>{t("Find a professional")} <ArrowRight size={17} /></Link>
      {!!userId && ownResult?.data?.includes(term.id) && <TermActions term={term} userId={userId} onChanged={removed=>removed?navigate("/terms",{replace:true}):refreshTerm(n=>n+1)}/>}
    </article>
  }
  return <section className="narrow"><Link className="back" to="/terms"><ArrowLeft size={17} /> {t("Explore terms")}</Link>{details()}</section>
}
function loadTerm(signal, id) {
  return api.getTerm(id.split(":")[0], signal)
}

function AccountForm({ register = false, session, loading, onSession }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || (new URLSearchParams(location.search).has('setup') ? '/profile' : '/')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    if (register && !fields.username.trim()) return setError(t('Enter a username.'))
    setPending(true)
    setError('')
    setNotice('')
    try {
      const credentials = { email: fields.email.trim(), password: fields.password }
      const result = register
        ? await api.register({ ...credentials, username: fields.username.trim(), account_type:fields.account_type, specialty:fields.specialty, experience_years:fields.experience_years, language:fields.language })
        : await api.login(credentials)
      if (result.session) navigate(register ? "/profile" : destination, { replace: true })
      else setNotice(t('Check your email to confirm your account, then log in.'))
    } catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }

  if (loading) return <p role="status">{t("Checking your session…")}</p>
  if (session) return <Navigate to={register ? "/profile" : destination} replace />
  return <section className="narrow account card">
    <BookOpen className="accent" size={30} />
    <h1>{register ? t('Create an account') : t('Log in')}</h1>
    {api.demo ? <>
      <p>{t("Try publishing a term, editing your profile, or requesting an appointment with the demo account.")}</p>
      <button className="button primary" onClick={() => onSession(api.enterDemo())}>{t("Continue as demo member")} <ArrowRight size={17} /></button>
    </> : <>
      <form onSubmit={submit}>
        {register && <label>{t("Username")}<input name="username" autoComplete="nickname" maxLength={50} required /></label>}
        {register&&<SignupFields/>}<label>{t("Email")}<input name="email" type="email" autoComplete="email" required /></label>
        <label>{t("Password")}<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 8 : undefined} required /></label>
        <Notice error>{error}</Notice><Notice>{notice}</Notice>
        <button className="button primary" disabled={pending}>{pending ? t('Please wait…') : register ? t('Sign up') : t('Log in')}</button>
      </form>
      <p><Link state={location.state} to={register ? '/login' : '/register'}>{register ? t('Already have an account? Log in') : t('Create an account')}</Link></p>
    </>}
  </section>
}

function Submit({ user }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    const fields = Object.fromEntries([...new FormData(event.currentTarget)].map(([key, value]) => [key, value.trim()]))
    if (!fields.jargon || !fields.translation) return setError(t('Enter a term and an explanation.'))
    setError('')
    setPending(true)
    try { navigate('/terms/' + await api.submitTerm(user.id, fields)) }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <section className="narrow page">
    <h1>{t("Share an explanation")}</h1><p>{t("Explain a term you’ve seen in a document, with an everyday example if you have one.")}</p>
    <form className="card form-card" onSubmit={submit}>
      <label>{t("Term")}<input name="jargon" required maxLength={160} placeholder={t("e.g. Notice period")} /></label>
      <label>{t("Category")}<select name="category" defaultValue="" required><option value="" disabled>{t("Choose a category")}</option>{api.categories.map(category => <option key={category} value={category}>{t(category)}</option>)}</select></label>
      <label>{t("In plain language")}<textarea name="translation" required maxLength={1500} /></label>
      <label>{t("Example (optional)")}<textarea name="analogy" maxLength={1500} /></label>
      <Notice error>{error}</Notice>
      <button className="button primary" disabled={pending}>{pending ? t('Publishing…') : t('Publish term')} <ArrowRight size={17} /></button>
    </form>
  </section>
}

function Booking({ professional, clientId, close, onSaved }) {
  const { t, i18n } = useTranslation()
  const dialog = useRef(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  useEffect(() => {
    const modal = dialog.current
    modal.showModal()
    return () => modal.close()
  }, [])

  async function book(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const description = fields.get('description').trim()
    if(description.length<5)return setError(chatWords(i18n.resolvedLanguage)[21])
    setPending(true)
    setError('')
    try {
      await api.requestConsultation(clientId, professional, null, fields.get('document'), description)
      onSaved()
    } catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <dialog ref={dialog} aria-labelledby="booking-title" onCancel={event => { event.preventDefault(); if (!pending) close() }}>
    <div className="section-head"><h2 id="booking-title">{t("Request a consultation")}</h2><button className="icon-link" onClick={close} disabled={pending} aria-label={t("Close")}><X size={20} /></button></div>
    <p><bdi>{professional.name}</bdi> · {localSpecialty(professional.specialty, i18n.resolvedLanguage)}</p><p>₪{professional.consultation_price||0} · {professional.consultation_minutes||30} {commerceWords(i18n.resolvedLanguage)[13]} · {commerceWords(i18n.resolvedLanguage)[1]}</p>
    {professional.is_demo && <p className="muted">{t("Demo requests are saved for testing.")}</p>}
    <form onSubmit={book}>
      <label>{chatWords(i18n.resolvedLanguage)[21]}<textarea name="description" required minLength={5} maxLength={5000}/></label>
      <label>{t("Document (optional PDF, up to 1 MB)")}<input type="file" name="document" accept="application/pdf,.pdf" /></label>
      <Notice error>{error}</Notice>
      <button className="button primary" disabled={pending}>{pending ? t('Saving…') : t('Send request')}</button>
    </form>
  </dialog>
}

function Professionals({ session }) {
  const { t, i18n } = useTranslation()
  const result = useRequest(api.listProfessionals)
  const [query, setQuery] = useState('')
  const [selected, select] = useState(null)
  const [notice, setNotice] = useState('')
  const [params,setParams]=useSearchParams(); const topic=params.get('category')||''; const relevant={Contracts:/lawyer|legal|contract/i,Employment:/lawyer|human resources|career|payroll/i,Housing:/lawyer|housing|civil engineer/i,Privacy:/privacy|cyber|software/i,Finance:/account|econom|bookkeep|insurance/i,Health:/physician|dentist|pediatric|physio/i,Engineering:/engineer/i}; const people = prioritize((result?.data || []).filter(person => person.id !== session?.user?.id && (!topic||!relevant[topic]||relevant[topic].test(localSpecialty(person.specialty,'en'))) && `${person.name} ${person.specialty} ${localSpecialty(person.specialty, i18n.resolvedLanguage)}`.toLowerCase().includes(query.trim().toLowerCase())), i18n.resolvedLanguage, p=>({...p,text:p.bio+' '+p.specialty}))
  return <section className="page">
    <div className="page-heading"><h1>{t("Find a professional")}</h1><p>{t("Browse specialists by name or expertise and request a consultation.")}</p></div>
    <label className="field-search"><Search size={19} /><input aria-label={t("Search professionals")} type="search" placeholder={t("Try “accountant”")} value={query} onChange={event => setQuery(event.target.value)} /></label>
    {topic&&<button className="button secondary" onClick={()=>setParams({})}>{t(topic)} · {t("Clear filters")}</button>}<Notice>{notice}</Notice><Notice error>{result?.error}</Notice>
    {!result && <p role="status">{t("Loading professionals…")}</p>}
    {result?.data && !people.length && <p>{t("No professionals found.")}</p>}
    <div className="grid ps-professionals-list">{people.map(person => <article className="card professional" key={person.id}><div className="ps-professional-details">
      <Author name={person.name} avatarPath={person.avatar_path} specialty={person.specialty} verified={person.is_verified} isDemo={person.is_demo} />
      {person.experience_years != null && <p>{experienceLabel(person.experience_years, i18n.resolvedLanguage)}</p>}
      {activePromotion(person,i18n.resolvedLanguage) && <small className="sponsored">{t("Sponsored")}</small>}
      {person.bio && <p dir="auto">{person.bio}</p>}
      {person.is_demo && <small className="muted">{t("Demo listing")}</small>}</div>
      {session ? <button className="button secondary" onClick={() => select(person)}>{t("Request consultation")} <ArrowRight size={17} /></button> :
        <Link className="button secondary" to="/login" state={{ from: '/professionals' }}>{t("Log in to request")} <ArrowRight size={17} /></Link>}
    </article>)}</div>
    {selected && session && selected.id !== session.user.id && <Booking professional={selected} clientId={session.user.id} close={() => select(null)} onSaved={() => { select(null); setNotice(t('Consultation request saved. You can view it in My account.')) }} />}
  </section>
}

function Plans({ session, profileResult, onChange }) {
  const { t, i18n } = useTranslation()
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const tier = profileResult?.data?.subscription_tier
  async function choose(id) {
    setPending(id)
    setError('')
    setNotice('')
    try { await api.choosePlan(id); onChange(); setNotice(t('Demo plan updated.')) }
    catch (failure) { setError(failure.message) }
    finally { setPending('') }
  }
  return <section className="page">
    <div className="page-heading"><h1>{t("Plans for every kind of contributor.")}</h1><p>{t("Try Free, Pro, and Organization. Demo plans never charge you.")}</p></div>
    <Notice>{notice}</Notice><Notice error>{error || profileResult?.error}</Notice>
    {session && !profileResult && <p role="status">{t("Loading your plan…")}</p>}
    <div className="grid">{plans.map(plan => <article className={'card plan ' + (plan.id === 'pro' ? 'featured' : '')} key={plan.id}>
      <h2>{t(plan.title)}</h2><p className="price">{"$" + plan.price}<small> {t("/ month")}</small></p><p>{t(plan.description)}</p>
      <ul>{plan.features.map(feature => <li key={feature}>{t(feature)}</li>)}</ul>
      {session ? <button className="button primary" disabled={Boolean(pending) || !profileResult?.data || tier === plan.id} onClick={() => choose(plan.id)}>{tier === plan.id ? t('Current plan') : pending === plan.id ? t('Saving…') : t('Choose') + ' ' + t(plan.title)}</button> :
        <Link className="button primary" to="/login" state={{ from: '/plans' }}>{t("Choose")} {t(plan.title)}</Link>}
    </article>)}</div>
  </section>
}

function Profile({ user, profileResult, onChange, onLogout }) {
  const { t, i18n } = useTranslation()
  const requests = useRequest(loadRequests, user.id)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const profile = profileResult?.data
  async function save(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const username = fields.get('username').trim()
    if (!username) return setError(t('Enter a username.'))
    setPending(true)
    setNotice('')
    setError('')
    try { await api.updateProfile(user.id, { username, bio: fields.get('bio').trim() }); onChange(); setNotice(t('Profile saved.')) }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  async function signout() {
    setPending(true)
    setError('')
    try { await api.logout(); onLogout(); navigate('/') }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <section className="narrow page">
    <div className="section-head"><h1>{t("Settings")}</h1><button className="button ps-danger" onClick={signout} disabled={pending}>{t("Log out")}</button></div>
    <Notice error>{error || profileResult?.error}</Notice><Notice>{notice}</Notice>
    {!profileResult && <p role="status">{t("Loading profile…")}</p>}
    {profile && <div className="card form-card">
      <Author name={profile.username} verified={profile.is_verified} isDemo={api.demo} specialty={t(plans.find(item => item.id === profile.subscription_tier)?.title || 'Free') + ' ' + t('plan')} />
      {api.demo ? <form onSubmit={save}>
        <label>{t("Username")}<input name="username" required maxLength={50} defaultValue={profile.username} /></label>
        <label>{t("Bio")}<textarea name="bio" maxLength={1000} defaultValue={profile.bio} /></label>
        <div className="actions"><button className="button primary" disabled={pending}>{t("Save profile")}</button><Link className="button secondary" to="/plans">{t("Manage plan")}</Link></div>
      </form> : <div className="actions"><Link className="button secondary" to="/plans">{t("Manage plan")}</Link><Link className="button secondary" to={'/community/'+user.id}>{t("My profile")}</Link></div>}
    </div>}
    <PhotoSettings id={user.id}/><ProviderPanel id={user.id}/><Link className="button secondary" to="/messages">{chatWords(i18n.resolvedLanguage)[0]}</Link><AccountCommunity id={user.id} username={profile?.username||"Member"} bio={profile?.bio||""} onChange={onChange}/><h2>{t("My consultations")}</h2><Notice error>{requests?.error}</Notice>
    {!requests && <p role="status">{t("Loading consultations…")}</p>}
    {requests?.data?.length === 0 && <div className="card empty"><CalendarDays size={23} /><p>{t("No requests yet.")}</p><Link to="/professionals">{t("Find a professional")}</Link></div>}
    <DeleteAccount onDone={()=>{onLogout();navigate("/",{replace:true})}}/>
    {requests?.data?.map(request => <article className="card request" key={request.id}><strong>{request.professionals?.name || 'Professional'}</strong><time dateTime={request.date}>{request.date ? localDate(request.date, i18n.resolvedLanguage) : chatWords(i18n.resolvedLanguage)[12]}</time><span className="category">{t(request.status)}</span>{request.price_agorot!=null&&<small>₪{request.price_agorot/100} · {request.duration_minutes} {commerceWords(i18n.resolvedLanguage)[13]}</small>}{request.document_name && <small>{request.document_name}</small>}</article>)}
  </section>
}

function loadRequests(signal, id) {
  return api.listRequests(id, signal)
}
function loadProfile(signal, id) {
  return id ? api.getProfile(id, signal) : null
}

function App() {
  const { t, i18n } = useTranslation()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileVersion, refresh] = useState(0)
  const id = session?.user.id || ''
  const key = `${id}:${profileVersion}`
  const profileResult = useRequest(loadVersionedProfile, key)
  const onChange = () => refresh(previous => previous + 1)
  const Router = api.demo ? HashRouter : BrowserRouter

  useEffect(() => api.watchSession(next => { setSession(next); setLoading(false) }), [])

  return <Router><Routes>
    <Route element={<Layout session={session} />}>
      <Route index element={<Community session={session} />} />
      <Route path="terms" element={<Explore session={session} />} />
      <Route path="accessibility" element={<AccessibilityStatement />} />
      <Route path="terms/:id" element={<TermDetails session={session} />} />
      <Route path="professionals" element={<Professionals session={session} />} />
      <Route path="community" element={<Community session={session} />} />
      <Route path="community/:personId" element={<Community session={session} />} />
      <Route path="plans" element={<BusinessPlans session={session} />} />
      <Route path="pricing" element={<Navigate to="/plans" replace />} />
      <Route path="login" element={<AccountForm key="login" session={session} loading={loading} onSession={setSession} />} />
      <Route path="register" element={<AccountForm key="register" register session={session} loading={loading} onSession={setSession} />} />
      <Route element={<Protected session={session} loading={loading} />}>
        <Route path="messages" element={<ConsultationChat key={id} id={id}/>}/>
        <Route path="submit" element={<Submit user={session?.user} />} />
        <Route path="settings" element={<Profile key={id} user={session?.user} profileResult={profileResult} onChange={onChange} onLogout={() => setSession(null)} />} />
        <Route path="profile" element={<Navigate to="/settings" replace />} />
      </Route>
      <Route path="*" element={<section className="page"><h1>{t("Page not found")}</h1><Link to="/">{t("Explore terms")}</Link></section>} />
    </Route>
  </Routes></Router>
}

function loadVersionedProfile(signal, key) {
  return loadProfile(signal, key.split(':')[0])
}

createRoot(document.getElementById('root')).render(<SettingsProvider><App /></SettingsProvider>)
