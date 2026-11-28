import {useEffect,useState} from 'react'
import * as api from './services'
export const messageLabels={ar:{new:'وصلتك رسالة جديدة',open:'فتح الرسائل',close:'إغلاق',unread:'رسائل غير مقروءة'},he:{new:'התקבלה הודעה חדשה',open:'פתיחת הודעות',close:'סגירה',unread:'הודעות שלא נקראו'},en:{new:'New message received',open:'Open messages',close:'Dismiss',unread:'Unread messages'}}
export function useMessageNotifications(id){
 const [counts,C]=useState({}),[toast,T]=useState(false)
 useEffect(()=>{C({});T(false);if(!id||api.demo)return;let live=true,previous=null,seq=0;
 async function refresh(){const request=++seq;try{const rows=await api.unreadMessages();if(!live||request!==seq)return;const next=Object.fromEntries(rows.map(r=>[r.consultation_id,Number(r.unread)]));if(previous&&Object.keys(next).some(k=>next[k]>(previous[k]||0)))T(true);previous=next;C(next)}catch(e){console.warn('Unread messages:',e.message)}}
 const stop=api.watchIncomingMessages(refresh),timer=setInterval(refresh,5000);window.addEventListener('ps-messages-read',refresh);window.addEventListener('focus',refresh);refresh();return()=>{live=false;stop();clearInterval(timer);window.removeEventListener('ps-messages-read',refresh);window.removeEventListener('focus',refresh)}
 },[id]);
 return {counts,total:Object.values(counts).reduce((a,b)=>a+b,0),toast,dismiss:()=>T(false)}
}
