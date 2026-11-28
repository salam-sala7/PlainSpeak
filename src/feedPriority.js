export const activePromotion=(d,lang)=>Boolean(d&&(d.sponsored||(Date.parse(d.promotion_until)>Date.now()&&(!d.promotion_audience||d.promotion_audience==='all'||d.promotion_audience===lang))))
export function contentLanguage(text) {
  const ar=(String(text||'').match(/\p{Script=Arabic}/gu)||[]).length
  const he=(String(text||'').match(/\p{Script=Hebrew}/gu)||[]).length
  return ar||he ? (ar>=he?'ar':'he') : 'en'
}
export function prioritize(items, lang, describe=x=>x) {
  const rank=x=>{const d=describe(x);return [activePromotion(d,lang)?0:d.is_verified && Date.parse(d.premium_until)>Date.now()?1:d.is_verified?2:3,(d.language||contentLanguage(d.text))===lang?0:1]}
  return [...items].sort((a,b)=>{const x=rank(a),y=rank(b);return x[0]-y[0]||x[1]-y[1]})
}

// Explore: paid/eligible sponsorship first, then the selected content language.
export function prioritizeTerms(items, lang) {
  const rank = d => [activePromotion(d,lang)?0:1, (d.language || contentLanguage(d.jargon+' '+d.translation))===lang?0:1];
  return [...items].sort((a,b)=>{const x=rank(a),y=rank(b);return x[0]-y[0]||x[1]-y[1]});
}
