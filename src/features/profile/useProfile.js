import { useEffect, useState } from 'react'
import { readProfile } from './profile'

export function useProfile(id) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const request = new AbortController()
    readProfile(id, request.signal).then(
      profile => {
        if (!request.signal.aborted) setResult({ id, profile })
      },
      error => {
        if (!request.signal.aborted) setResult({ id, error: error.message })
      }
    )

    return () => request.abort()
  }, [id])

  return result?.id === id ? result : null
}
