import assert from 'node:assert/strict'
import test from 'node:test'
import { prioritize, prioritizeTerms } from './feedPriority.js'

test('sponsored entries precede verified and ordinary entries, with selected language first within each group', () => {
  const items = [
    { id: 'ordinary-ar', language: 'ar' },
    { id: 'verified-en', is_verified: true, language: 'en' },
    { id: 'sponsored-en', sponsored: true, language: 'en' },
    { id: 'verified-ar', is_verified: true, language: 'ar' },
    { id: 'sponsored-ar', sponsored: true, text: 'نص عربي' },
    { id: 'ordinary-en', language: 'en' },
    { id: 'ordinary-ar-second', language: 'ar' }
  ]
  const original = items.slice()
  assert.deepEqual(prioritize(items, 'ar').map(item => item.id), [
    'sponsored-ar', 'sponsored-en', 'verified-ar', 'verified-en',
    'ordinary-ar', 'ordinary-ar-second', 'ordinary-en'
  ])
  assert.deepEqual(prioritize(items, 'en').map(item => item.id), [
    'sponsored-en', 'sponsored-ar', 'verified-en', 'verified-ar',
    'ordinary-en', 'ordinary-ar', 'ordinary-ar-second'
  ])
  assert.deepEqual(items, original)
})

test('glossary: sponsored first, selected language next, expired or non-targeted campaigns not boosted',()=>{
 const items=[{id:'he',jargon:'חוזה',author_verified:true},{id:'ar',jargon:'عقد'},{id:'en',jargon:'contract'},{id:'paid',jargon:'contract',sponsored:true},{id:'active',jargon:'חוזה',promotion_until:'2099-01-01',promotion_audience:'all'},{id:'expired',jargon:'חוזה',promotion_until:'2000-01-01'},{id:'targeted',jargon:'חוזה',promotion_until:'2099-01-01',promotion_audience:'he'}];
 for(const [lang,first] of [['ar','ar'],['he','he'],['en','en']]) {const result=prioritizeTerms(items,lang);const paid=lang==='he'?3:2;assert.equal(result[paid].id,first);assert.ok(result.slice(0,paid).every(x=>['paid','active','targeted'].includes(x.id)));}
 assert.equal(items[0].id,'he');
});
