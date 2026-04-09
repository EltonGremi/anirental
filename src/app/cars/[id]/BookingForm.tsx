'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format'
import { phoneSchema, dateSchema, noteSchema } from '@/lib/validators'

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

    // Validimi me Zod
    try {
      phoneSchema.parse(phoneNumber)
      dateSchema.parse(startDate)
      dateSchema.parse(endDate)
      noteSchema.parse(notes)
    } catch (err: any) {
      setError(err.message || 'Gabim validimi')
      return
    }

    if (datesOverlap()) {
      setError('Datat e zgjedhura mbivendosen me një rezervim ekzistues.')
      return
    }

    const days = calcDays()
    if (days <= 0) {
      setError('Zgjidh një periudhë të vlefshme.')
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
      setError('Gabim gjatë rezervimit: ' + err.message)
    } else {
      router.push('/booking/success')
    }
  }

  const days = calcDays()
  const total = days * vehicle.daily_rate

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-medium text-gray-900 mb-6">Kërko rezervim</h2>

      {!user && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-700">
          Duhet të hysh për të rezervuar.{' '}
          <a href="/login" className="font-medium underline">Hyr këtu</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Data e fillimit</label>
            <input type="date" value={startDate} min={today}
              onChange={e => setStartDate(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Data e përfundimit</label>
            <input type="date" value={endDate} min={startDate || today}
              onChange={e => setEndDate(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Numri i telefonit <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="P.sh. +355 69 123 4567 ose 06912345"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <p className="text-xs text-gray-400 mt-1">E nevojshme për t'ju kontaktuar në lidhje me rezervimin</p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Shënime (opsionale)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="P.sh. marrje në aeroport..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        {days > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <div className="flex justify-between text-gray-500 mb-1">
              <span>{formatPrice(vehicle.daily_rate)} ALL × {days} ditë</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 text-base">
              <span>Totali i vlerësuar</span>
              <span>{formatPrice(total)} ALL</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Çmimi është tregues — do të konfirmohet nga admini përmes Telegram</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !user}
          className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-50">
          {loading ? 'Duke dërguar kërkesën...' : 'Dërgo kërkesën për rezervim'}
        </button>
      </form>
    </div>
  )
}