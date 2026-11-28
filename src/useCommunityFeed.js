import {useCallback,useEffect,useRef,useState} from 'react'
import {communityFeed,subscribeCommunity} from './services'
export function useCommunityFeed(){
 const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true)
 const generation=useRef(0)
 const refresh=useCallback(async()=>{const n=++generation.current;try{const d=await communityFeed();if(n===generation.current){setData(d);setError('')}return d}catch(e){if(n===generation.current)setError(e.message);throw e}finally{if(n===generation.current)setLoading(false)}},[])
 useEffect(()=>{refresh().catch(()=>{});let timer;const stop=subscribeCommunity(()=>{clearTimeout(timer);timer=setTimeout(()=>refresh().catch(()=>{}),250)});return()=>{clearTimeout(timer);stop();generation.current++}},[refresh])
 return {data,error,loading,refresh}
}
