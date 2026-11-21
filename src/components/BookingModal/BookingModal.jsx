import { useEffect, useRef, useState } from 'react'
import { bookConsultation } from '../../features/consultations/consultations'

export default function BookingModal({ professional, clientId, onClose, onBooked }) {
  const dialog = useRef(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [])

  async function submit(event) {
    event.preventDefault()
    if (pending) return
    const date = new Date(new FormData(event.currentTarget).get('date'))
    if (!Number.isFinite(date.getTime()) || date <= new Date()) {
      setError('Choose a future date and time.')
      return
    }

    setPending(true)
    setError('')
    try {
      await bookConsultation(clientId, professional.id, date.toISOString())
    } catch (failure) {
      setError(failure.message)
      setPending(false)
      return
    }
    onBooked(professional.is_demo ? 'Demo request saved.' : 'Consultation request saved.')
  }

  return (
    <dialog ref={dialog} aria-labelledby="booking-title" onCancel={event => {
      event.preventDefault()
      if (!pending) onClose()
    }}>
      <h2 id="booking-title">Request time with {professional.name}</h2>
      {professional.is_demo && <p>This is a demo listing.</p>}
      <form onSubmit={submit}>
        <label>Preferred date and local time<input type="datetime-local" name="date" required /></label>
        {error && <p role="alert">{error}</p>}
        <button disabled={pending}>{pending ? 'Saving…' : 'Send request'}</button>
        <button type="button" onClick={onClose} disabled={pending}>Cancel</button>
      </form>
    </dialog>
  )
}
