import { useEffect, useState, useRef } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { Accessibility, Moon, Sun, Globe, X, Volume2, Square } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { contentLanguage } from './feedPriority.js'
import dictionary from './translations.json'
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem('ps-pref-'+key)) ?? fallback } catch { return fallback } }
const write = (key, value) => { try { localStorage.setItem('ps-pref-'+key, JSON.stringify(value)) } catch {} }
const languages = ['en','ar','he']
const initial = read('language','en')
const resources = Object.fromEntries(languages.map(lang => [lang,{translation:Object.fromEntries(Object.entries(dictionary).map(([key,v]) => [key,lang==='en'?key:v[lang]]))}]))
i18n.use(initReactI18next).init({resources,lng:languages.includes(initial)?initial:'en',fallbackLng:'en',keySeparator:false,nsSeparator:false,interpolation:{escapeValue:false},initImmediate:false})
function syncLanguage(){const lang=i18n.resolvedLanguage||'en';document.documentElement.lang=lang;document.documentElement.dir=lang==='en'?'ltr':'rtl';write('language',lang)}
syncLanguage()
i18n.on('languageChanged',syncLanguage)
export function SettingsProvider({children}) {
  useEffect(()=>{
    if(import.meta.env.DEV && new URLSearchParams(location.search).has('a11y')) {
      let active=true
      import('axe-core').then(({default:axe})=>{
        if(active) window.runPlainSpeakAccessibilityAudit=async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});console.table(result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.length})));return result}
      })
      return ()=>{active=false;delete window.runPlainSpeakAccessibilityAudit}
    }
  },[])
  return children
}
const defaults={size:100,contrast:false,underline:false,motion:false}
export function Preferences(){
  const {t,i18n}=useTranslation()
  const {pathname}=useLocation()
  const utterance=useRef(null)
  const [dark,setDark]=useState(()=>read('dark',window.matchMedia('(prefers-color-scheme: dark)').matches))
  const [prefs,setPrefs]=useState(()=>({...defaults,...read('access',{})}))
  const [open,setOpen]=useState(false)
  const [speechStatus,setSpeechStatus]=useState('')
  const [selected,setSelected]=useState('')
  const selection=useRef({text:'',lang:''})
  const launcher=useRef(null)
  const panel=useRef(null)
  const supported=typeof window.speechSynthesis!=='undefined' && typeof window.SpeechSynthesisUtterance!=='undefined'
  useEffect(()=>{const capture=()=>{const sel=window.getSelection();const text=sel?.toString().trim();if(text){const node=sel.anchorNode;const el=node?.nodeType===1?node:node?.parentElement;if(el?.closest('#ps-access-panel'))return;selection.current={text,lang:el?.closest('[lang]')?.lang||document.documentElement.lang};setSelected(text)}};document.addEventListener('selectionchange',capture);return()=>document.removeEventListener('selectionchange',capture)},[])
  useEffect(()=>{if(open)panel.current?.focus()},[open])
  function close(){setOpen(false);launcher.current?.focus()}
  function speak(){
    if(!supported)return
    const {text,lang}=selection.current
    if(!text){setSpeechStatus('Select text first');return}
    stop()
    const language=/\p{L}/u.test(text)?contentLanguage(text):lang||'en'
    const locale={ar:'ar-SA',he:'he-IL',en:'en-US'}[language]||language
    const voices=window.speechSynthesis.getVoices()
    const voice=voices.find(candidate=>candidate.lang.toLowerCase()===locale.toLowerCase())
      || voices.find(candidate=>candidate.lang.toLowerCase().split('-')[0]===language)
    const speech=new window.SpeechSynthesisUtterance(text)
    if(voice)speech.voice=voice
    speech.lang=voice?.lang||locale
    const finish=status=>{
      if(utterance.current!==speech)return
      utterance.current=null
      setSpeechStatus(status)
    }
    speech.onend=()=>finish('')
    speech.onerror=()=>finish('Speech unavailable')
    utterance.current=speech
    setSpeechStatus('Reading aloud')
    try{window.speechSynthesis.speak(speech)}catch{finish('Speech unavailable')}
  }
  function stop(){
    if(utterance.current){
      utterance.current=null
      window.speechSynthesis.cancel()
    }
    setSpeechStatus('')
  }
  useEffect(()=>{
    selection.current={text:'',lang:''}
    setSelected('')
    setSpeechStatus('')
    return ()=>{
      if(!utterance.current)return
      utterance.current=null
      window.speechSynthesis.cancel()
    }
  },[pathname])

  useEffect(()=>{const root=document.documentElement;root.dataset.theme=dark?'dark':'light';root.dataset.contrast=String(prefs.contrast);root.dataset.underline=String(prefs.underline);root.dataset.reduceMotion=String(prefs.motion);root.style.fontSize=prefs.size+'%';write('dark',dark);write('access',prefs)},[dark,prefs])
  const toggle=k=>setPrefs(p=>({...p,[k]:!p[k]}))
  return <div className="ps-preferences">
    <label className="ps-language"><Globe size={18} aria-hidden="true"/><span className="ps-sr-only">{t('Language')}</span><select value={i18n.resolvedLanguage||'en'} onChange={e=>i18n.changeLanguage(e.target.value)}><option lang="en" value="en">English</option><option lang="ar" value="ar">العربية</option><option lang="he" value="he">עברית</option></select></label>
    <button type="button" className="ps-control" aria-label={t(dark?'Light mode':'Dark mode')} title={t(dark?'Light mode':'Dark mode')} onClick={()=>setDark(v=>!v)}>{dark?<Sun aria-hidden="true" size={20}/>:<Moon aria-hidden="true" size={20}/>}</button>
    <button type="button" ref={launcher} className="ps-access-launcher" aria-expanded={open} aria-controls="ps-access-panel" aria-label={t('Accessibility')} title={t('Accessibility')} onClick={()=>setOpen(v=>!v)}><Accessibility aria-hidden="true" size={21}/></button>
    <section ref={panel} tabIndex={-1} id="ps-access-panel" className="ps-access-panel" hidden={!open} aria-label={t('Accessibility')} onKeyDown={e=>{if(e.key==='Escape')close()}}>
      <div className="ps-panel-head"><h2>{t('Accessibility')}</h2><button type="button" aria-label={t('Close')} onClick={close}><X size={22}/></button></div><label>{t('Text size')} <output>{prefs.size}%</output><input type="range" min="100" max="200" step="25" value={prefs.size} onChange={e=>setPrefs(p=>({...p,size:Number(e.target.value)}))}/></label>
      <label><input type="checkbox" checked={prefs.contrast} onChange={()=>toggle('contrast')}/>{t('High contrast')}</label>
      <label><input type="checkbox" checked={prefs.underline} onChange={()=>toggle('underline')}/>{t('Underline links')}</label>
      <label><input type="checkbox" checked={prefs.motion} onChange={()=>toggle('motion')}/>{t('Reduce motion')}</label>
      <div className="ps-speech"><p>{t('Select text on the page to hear it aloud.')}</p><button type="button" disabled={!supported||!selected} onClick={speak}><Volume2 size={20}/>{t('Read selected text')}</button><button type="button" disabled={!supported} onClick={stop}><Square size={16}/>{t('Stop reading')}</button><p role="status">{t(!supported?'Speech unavailable':speechStatus)}</p></div>
      <button type="button" className="ps-control" onClick={()=>{setPrefs({...defaults});stop()}}>{t('Reset')}</button>
      <p><Link to="/accessibility" onClick={close}>{t('Accessibility statement')}</Link></p>
    </section>
  </div>
}
