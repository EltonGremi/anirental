'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format'

interface Props {
  vehicle: any
  user: any
  bookedDates: { start_date: string; end_date: string }[]
}

export default function BookingForm({ vehicle, user, bookedDates }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function calcDays() {
    if (!startDate || !endDate) return 0
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  function isDateBooked(date: string) {
    return bookedDates.some(b => date >= b.start_date && date <= b.end_date)
  }

  function datesOverlap() {
    if (!startDate || !endDate) return false
    return bookedDates.some(b =>
      startDate <= b.end_date && endDate >= b.start_date
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!user) {
      router.push('/login')
      return
    }

    if (!phoneNumber.trim()) {
      setError('Il numero di telefono è obbligatorio.')
      return
    }

    // Validazione formato telefono (almeno 9 caratteri)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (phoneNumber.length < 9 || !phoneRegex.test(phoneNumber)) {
      setError('Inserisci un numero di telefono valido.')
      return
    }

    if (datesOverlap()) {
      setError('Le date selezionate si sovrappongono a una prenotazione esistente.')
      return
    }

    const days = calcDays()
    if (days <= 0) {
      setError('Seleziona un periodo valido.')
      return
    }

    setLoading(true)

    const { error: err } = await supabase.from('bookings').insert({
      vehicle_id: vehicle.id,
      client_id: user.id,
      start_date: startDate,
      end_date: endDate,
      phone_number: phoneNumber.trim(),
      total_price: days * vehicle.daily_rate,
      notes: notes || null,
      status: 'pending',
    })

    setLoading(false)

    if (err) {
      setError('Errore durante la prenotazione: ' + err.message)
    } else {
      router.push('/booking/success')
    }
  }

  const days = calcDays()
  const total = days * vehicle.daily_rate

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-medium text-gray-900 mb-6">Richiedi prenotazione</h2>

      {!user && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-700">
          Devi accedere per prenotare.{' '}
          <a href="/login" className="font-medium underline">Accedi qui</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Data inizio</label>
            <input type="date" value={startDate} min={today}
              onChange={e => setStartDate(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Data fine</label>
            <input type="date" value={endDate} min={startDate || today}
              onChange={e => setEndDate(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Numero di telefono <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Es. +355 69 123 4567 o 06912345"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <p className="text-xs text-gray-400 mt-1">Necessario per contattarti riguardo la prenotazione</p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Note (opzionale)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Es. ritiro in aeroporto..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        {days > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <div className="flex justify-between text-gray-500 mb-1">
              <span>{formatPrice(vehicle.daily_rate)} ALL × {days} giorni</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 text-base">
              <span>Totale stimato</span>
              <span>{formatPrice(total)} ALL</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Il prezzo è indicativo — verrà confermato dall'admin via Telegram</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !user}
          className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-50">
          {loading ? 'Invio richiesta...' : 'Invia richiesta di prenotazione'}
        </button>
      </form>
    </div>
  )
}