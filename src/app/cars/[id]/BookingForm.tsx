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
    <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-zinc-100 p-6 md:p-10 flex flex-col gap-6 md:gap-8">
      <div className="border-b border-zinc-100 pb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-black">Kërko rezervim</h2>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-amber-700">
          Duhet të hysh për të rezervuar.{' '}
          <a href="/login" className="font-semibold underline">Hyr këtu</a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Data e fillimit</label>
            <input type="date" value={startDate} min={today}
              onChange={e => setStartDate(e.target.value)} required
              className="w-full bg-zinc-50 border-0 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-black outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Data e përfundimit</label>
            <input type="date" value={endDate} min={startDate || today}
              onChange={e => setEndDate(e.target.value)} required
              className="w-full bg-zinc-50 border-0 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-black outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">
            Numri i telefonit <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="P.sh. +355 69 123 4567 ose 06912345"
            required
            className="w-full bg-zinc-50 border-0 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-black outline-none transition-all" />
          <p className="text-xs text-zinc-400 mt-2 font-light">E nevojshme për t'ju kontaktuar në lidhje me rezervimin</p>
        </div>

        <div>
          <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Shënime (opsionale)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="P.sh. marrje në aeroport..."
            className="w-full bg-zinc-50 border-0 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-black outline-none transition-all" />
        </div>

        {days > 0 && (
          <div className="bg-zinc-50 rounded-2xl p-5 md:p-6 text-sm md:text-base border border-zinc-100">
            <div className="flex justify-between text-zinc-500 mb-2 font-light">
              <span>{formatPrice(vehicle.daily_rate)} ALL × {days} ditë</span>
            </div>
            <div className="flex justify-between font-bold text-black text-lg md:text-xl">
              <span>Totali i vlerësuar</span>
              <span>{formatPrice(total)} ALL</span>
            </div>
            <p className="text-xs text-zinc-400 mt-3 font-light">Çmimi është tregues — do të konfirmohet nga admini përmes Telegram</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-red-600 font-medium">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !user}
          className="w-full bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full py-4 md:py-5 text-base md:text-lg font-medium transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]">
          {loading ? 'Duke dërguar kërkesën...' : 'Dërgo kërkesën për rezervim'}
        </button>
      </form>
    </div>
  )
}