import { createClient } from '@supabase/supabase-js'
import sample from './demo-data.json'

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: key } = import.meta.env
export const demo = !url || !key
const supabase = demo ? null : createClient(url, key)
const storageKey = 'plainspeak-new-v1'
const demoId = 'plainspeak-demo-member'
const demoProfile = { id: demoId, username: 'Jamie Carter', bio: '', subscription_tier: 'free' }

function read() {
  const initial = { signedIn: false, profile: demoProfile, terms: [], requests: [] }
  try {
    return { ...initial, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }
  } catch {
    return initial
  }
}

function save(data) {
  localStorage.setItem(storageKey, JSON.stringify(data))
}

async function unwrap(operation) {
  const result = await operation
  if (result.error) throw new Error(result.error.message)
  return result.data
}

function demoSession() {
  return read().signedIn ? { user: { id: demoId } } : null
}

export function watchSession(callback) {
  if (demo) {
    callback(demoSession())
    const sync = () => callback(demoSession())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => subscription.unsubscribe()
}

export function enterDemo() {
  const state = read()
  state.signedIn = true
  save(state)
  return demoSession()
}

export function register({ username, account_type, specialty, experience_years, language, ...credentials }) {
  return unwrap(supabase.auth.signUp({
    ...credentials,
    options: { data: { username, ps_signup: "yes", account_type, specialty, experience_years, language }, emailRedirectTo: new URL('/login?setup=1', window.location.origin).href },
  }))
}

export function login(credentials) {
  return unwrap(supabase.auth.signInWithPassword(credentials))
}

export async function logout() {
  if (!demo) return unwrap(supabase.auth.signOut())
  save({ ...read(), signedIn: false })
}

export const categories = ['Contracts', 'Employment', 'Housing', 'Privacy']

const importedAt = Date.now()
const demoTerms = sample.terms.map(({ age, ...term }) => ({
  ...term,
  created_at: new Date(importedAt - age * 60_000).toISOString(),
  is_demo: true,
}))

export async function listTerms(signal) {
  if (demo) {
    const state = read()
    const ownTerms = state.terms.map(term => ({ ...term, author_name: state.profile.username }))
    return [...demoTerms, ...ownTerms].sort((a, b) =>
      Number(b.sponsored) - Number(a.sponsored) || b.created_at.localeCompare(a.created_at))
  }
  const terms = []
  const pageSize = 200
  for (let start = 0; !signal.aborted; start += pageSize) {
    const page = await unwrap(supabase.rpc('read_public_terms_with_avatars')
      .order('sponsored', { ascending: false }).order('created_at', { ascending: false })
      .order('id').range(start, start + pageSize - 1).abortSignal(signal))
    terms.push(...page)
    if (page.length < pageSize) break
  }
  return terms
}

export async function getTerm(id, signal) {
  if (demo) return (await listTerms(signal)).find(term => term.id === id) ?? null
  if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id)) return null
  return unwrap(supabase.rpc('read_public_terms_with_avatars').eq('id',id).abortSignal(signal).maybeSingle())
}

export async function submitTerm(id, fields) {
  if (!demo) {
    const term = await unwrap(supabase.from('terms')
      .insert({ ...fields, user_id: id }).select('id').single())
    return term.id
  }
  const state = read()
  const term = { ...fields, id: crypto.randomUUID(), user_id: id, created_at: new Date().toISOString() }
  save({ ...state, terms: [...state.terms, term] })
  return term.id
}

export async function listProfessionals(signal) {
  if (demo) return [...sample.professionals].sort((a, b) => a.name.localeCompare(b.name))
  const people = await unwrap(supabase.from('professionals').select('*').order('name').abortSignal(signal))
  const details = await unwrap(supabase.from('community_profiles').select('id, experience_years, language, premium_until, avatar_path').abortSignal(signal))
  const experience = new Map(details.map(p => [p.id, p]))
  return people.map(p => ({...p, avatar_path: experience.get(p.id)?.avatar_path, experience_years: experience.get(p.id)?.experience_years, language: experience.get(p.id)?.language, premium_until: experience.get(p.id)?.premium_until || p.premium_until}))
}

export async function getProfile(id, signal) {
  if (demo) return read().profile
  return unwrap(supabase.from('profiles').select('id, username, bio, subscription_tier, is_verified')
    .eq('id', id).abortSignal(signal).single())
}

export async function updateProfile(id, fields) {
  if (!demo) return unwrap(supabase.from('profiles').update(fields).eq('id', id))
  const state = read()
  save({ ...state, profile: { ...state.profile, ...fields } })
}

export async function choosePlan(tier) {
  if (!demo) return unwrap(supabase.rpc('set_demo_subscription', { tier }))
  await updateProfile(demoId, { subscription_tier: tier })
  return tier
}

export async function listRequests(id, signal) {
  if (demo) return [...read().requests].reverse()
  return unwrap(supabase.from('consultations')
    .select('id, date, status, document_name, price_agorot, commission_agorot, duration_minutes, professionals(name)')
    .eq('client_id', id).order('date', { ascending: false }).abortSignal(signal))
}

export async function requestConsultation(clientId, professional, date, file, description) {
  if (!clientId || clientId === professional.id) throw new Error("You cannot request a consultation with yourself.")
  const row = { client_id: clientId, pro_id: professional.id, request_body: description }
  if (file?.size) {
    if (file.size > 1_048_576 || !/\.pdf$/i.test(file.name)) {
      throw new Error('Choose a PDF up to 1 MB.')
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') {
      throw new Error('Choose a valid PDF file.')
    }
    row.document_name = file.name
    row.document_pdf = '\\x' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  if (!demo) return unwrap(supabase.from('consultations').insert(row))
  const state = read()
  if (state.requests.some(request => request.pro_id === professional.id && request.date === date)) {
    throw new Error('You already requested this time.')
  }
  state.requests.push({
    id: crypto.randomUUID(), pro_id: professional.id, date, status: 'requested',
    document_name: row.document_name, professionals: { name: professional.name },
  })
  save(state)
}

// Community data is stored in Supabase, not browser demo mode.
export async function communityFeed() {
  if (demo) throw new Error('Connect Supabase to use the community.')
  const [posts, people, replies, likes, follows, stats] = await Promise.all([
    unwrap(supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(500)),
    unwrap(supabase.from('community_profiles').select('*').limit(500)),
    unwrap(supabase.from('community_replies').select('*').order('created_at').limit(1000)),
    unwrap(supabase.from('community_likes').select('*').limit(1000)),
    unwrap(supabase.from('community_follows').select('*').limit(1000)),
    unwrap(supabase.from('community_contribution_counts').select('*').limit(500)),
  ])
  return { posts, people, replies, likes, follows, stats }
}
export function getCommunityProfile(id) {
  return unwrap(supabase.from('community_profiles').select('*').eq('id', id).maybeSingle())
}
export function publishCommunityProfile(id, fields, exists) {
  const table=supabase.from('community_profiles')
  return unwrap(exists ? table.update(fields).eq('id',id) : table.insert({id,...fields}))
}
export function communityMediaUrl(path) {return path && supabase ? supabase.storage.from('community-media').getPublicUrl(path).data.publicUrl : null}
export async function publishCommunityPost(id, fields) {
  const {mediaFile,media_description,...rest}=fields
  if(!mediaFile?.size) return unwrap(supabase.from('community_posts').insert({author_id:id,...rest}))
  const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'}[mediaFile.type]
  if(!ext||mediaFile.size>20971520||!media_description?.trim()) throw new Error('Invalid attachment or missing description')
  const path=`${id}/${crypto.randomUUID()}.${ext}`
  const storage=supabase.storage.from('community-media')
  await unwrap(storage.upload(path,mediaFile,{contentType:mediaFile.type,upsert:false}))
  try{return await unwrap(supabase.from('community_posts').insert({author_id:id,...rest,media_path:path,media_type:mediaFile.type.startsWith('image/')?'image':'video',media_description:media_description.trim()}))}
  catch(error){await storage.remove([path]);throw error}
}
export function publishCommunityReply(id, postId, body) {
  return unwrap(supabase.from('community_replies').insert({author_id:id,post_id:postId,body}))
}
export function toggleCommunityLike(id, postId, active) {
  const table=supabase.from('community_likes')
  return unwrap(active ? table.delete().eq('user_id',id).eq('post_id',postId) : table.insert({user_id:id,post_id:postId}))
}
export function toggleCommunityFollow(id, other, active) {
  const table=supabase.from('community_follows')
  return unwrap(active ? table.delete().eq('follower_id',id).eq('following_id',other) : table.insert({follower_id:id,following_id:other}))
}

export function editCommunityPost(id, postId, fields) {return unwrap(supabase.from('community_posts').update({title:fields.title,body:fields.body,edited_at:new Date().toISOString()}).eq('id',postId).eq('author_id',id))}
export function deleteCommunityPost(id, postId) {return unwrap(supabase.from('community_posts').delete().eq('id',postId).eq('author_id',id))}
export function editCommunityReply(id, replyId, body) {return unwrap(supabase.from('community_replies').update({body,edited_at:new Date().toISOString()}).eq('id',replyId).eq('author_id',id))}
export function deleteCommunityReply(id, replyId) {return unwrap(supabase.from('community_replies').delete().eq('id',replyId).eq('author_id',id))}
export async function submitProof(id,file){if(!file?.size||file.size>10485760||!['application/pdf','image/jpeg','image/png'].includes(file.type))throw new Error('PDF/JPEG/PNG, max 10 MB');const ext={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[file.type];const path=`${id}/${crypto.randomUUID()}.${ext}`;await unwrap(supabase.storage.from('professional-proof').upload(path,file));return unwrap(supabase.from('ps_verification_requests').insert({user_id:id,document_path:path}))}
export function verificationStatus(id){return unwrap(supabase.from('ps_verification_requests').select('id,status,created_at').eq('user_id',id).order('created_at',{ascending:false}))}
export const commercialOrders=()=>unwrap(supabase.from('ps_commercial_orders').select('*').order('created_at',{ascending:false}))
export const commercialCheckout=(kind,post=null,days=7,daily=5,audience='all')=>unwrap(supabase.rpc('ps_demo_checkout',{p_kind:kind,p_post:post,p_days:days,p_daily:daily,p_audience:audience}))
export const setConsultationRate=(price,minutes)=>unwrap(supabase.rpc('ps_set_consultation',{p_price:price,p_minutes:minutes}))
export const providerBookings=()=>unwrap(supabase.rpc('ps_provider_bookings'))
export const changeBookingStatus=(id,status)=>unwrap(supabase.rpc('ps_booking_status',{p_id:id,p_status:status}))
export async function deleteMyAccount(password){
 if(demo){localStorage.removeItem(storageKey);return}
 const {user}=await unwrap(supabase.auth.getUser());if(!user?.email)throw new Error('Email account required');
 const verified=await unwrap(supabase.auth.signInWithPassword({email:user.email,password}));if(verified.user.id!==user.id)throw new Error('Account mismatch');
 for(const bucket of ['community-media','professional-proof','profile-images']){const storage=supabase.storage.from(bucket);for(let batch=0;batch<100;batch++){const files=await unwrap(storage.list(user.id,{limit:100}));if(!files.length)break;const paths=files.filter(f=>f.id).map(f=>`${user.id}/${f.name}`);if(paths.length!==files.length)throw new Error('Nested media requires administrator cleanup');await unwrap(storage.remove(paths));}}
 await unwrap(supabase.rpc('ps_delete_my_account'));await supabase.auth.signOut({scope:'local'});
}

// Subscribe through the hosted Supabase client; no custom server.
export function subscribeCommunity(onChange){
 if(!supabase)return ()=>{};
 const channel=supabase.channel('community-feed-'+crypto.randomUUID());
 for(const table of ['community_posts','community_replies','community_likes','community_follows','community_profiles'])channel.on('postgres_changes',{event:'*',schema:'public',table},onChange);
 channel.subscribe();return ()=>{supabase.removeChannel(channel)};
}

export function setQuestionResolved(postId,resolved){return unwrap(supabase.rpc('ps_set_question_resolved',{p_id:postId,p_resolved:resolved}))}

// Owner-only glossary CRUD; the database also enforces ownership with RLS.
export async function listOwnTermIds(userId, signal) {
  if (!userId) return []
  if (demo) return read().terms.filter(t=>t.user_id===userId).map(t=>t.id)
  const ids=[]; for(let start=0; !signal.aborted; start+=200){
    const rows=await unwrap(supabase.from('terms').select('id').eq('user_id',userId).order('id').range(start,start+199).abortSignal(signal));
    ids.push(...rows.map(t=>t.id)); if(rows.length<200)break;
  } return ids
}
export async function updateTerm(userId,id,{jargon,translation,analogy,category}) {
  const fields={jargon,translation,analogy,category};
  if (!demo) return unwrap(supabase.from('terms').update(fields).eq('id',id).eq('user_id',userId).select('id').single())
  const state=read(); if(!state.terms.some(t=>t.id===id&&t.user_id===userId))throw new Error('Not authorized');
  save({...state,terms:state.terms.map(t=>t.id===id?{...t,...fields}:t)})
}
export async function deleteTerm(userId,id) {
  if (!demo) return unwrap(supabase.from('terms').delete().eq('id',id).eq('user_id',userId).select('id').single())
  const state=read(); if(!state.terms.some(t=>t.id===id&&t.user_id===userId))throw new Error('Not authorized');
  save({...state,terms:state.terms.filter(t=>t.id!==id)})
}

export const myThreads=()=>demo?Promise.resolve([]):unwrap(supabase.rpc('ps_my_threads'))
export const threadMessages=id=>unwrap(supabase.from('ps_messages').select('*').eq('consultation_id',id).order('created_at').limit(1000))
export const sendThreadMessage=(id,body)=>unwrap(supabase.from('ps_messages').insert({consultation_id:id,body}))
export const scheduleBooking=(id,action,date=null)=>unwrap(supabase.rpc('ps_schedule_booking',{p_id:id,p_action:action,p_date:date}))
export function watchMessages(id,callback){if(!supabase)return()=>{};const c=supabase.channel('messages-'+id+'-'+crypto.randomUUID()).on('postgres_changes',{event:'INSERT',schema:'public',table:'ps_messages',filter:'consultation_id=eq.'+id},callback).subscribe();return()=>supabase.removeChannel(c)}
export const avatarUrl=path=>path&&supabase?supabase.storage.from('profile-images').getPublicUrl(path).data.publicUrl:null
export async function changeAvatar(id,file){let path=null;if(file){if(!file.size||file.size>5242880||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('JPEG/PNG/WebP, max 5 MB');path=id+'/'+crypto.randomUUID()+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type]);await unwrap(supabase.storage.from('profile-images').upload(path,file))}const old=await getCommunityProfile(id);await unwrap(supabase.from('community_profiles').update({avatar_path:path}).eq('id',id));if(old?.avatar_path?.startsWith(id+'/'))await supabase.storage.from('profile-images').remove([old.avatar_path])}

export const threadDocument=id=>unwrap(supabase.rpc('ps_thread_document',{p_id:id}).maybeSingle())

export const unreadMessages=()=>demo?Promise.resolve([]):unwrap(supabase.rpc('ps_unread_messages'))
export const markMessagesRead=(thread,ids)=>demo||!ids.length?Promise.resolve():unwrap(supabase.rpc('ps_mark_messages_read',{p_thread:thread,p_ids:ids}))
export function watchIncomingMessages(callback){if(!supabase)return()=>{};const channel=supabase.channel('incoming-'+crypto.randomUUID()).on('postgres_changes',{event:'INSERT',schema:'public',table:'ps_messages'},callback).subscribe();return()=>supabase.removeChannel(channel)}
