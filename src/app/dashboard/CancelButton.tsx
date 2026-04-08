'use client'

import { useState } from 'react'
import { cancelBooking } from '@/app/actions/bookings'

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleCancel() {
    if (!confirm) {
      setConfirm(true)
      return
    }

    setLoading(true)
    const result = await cancelBooking(bookingId)
    setLoading(false)

    if (result?.error) {
      alert(result.error)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Sei sicuro?</span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-xs text-white bg-gray-700 hover:bg-gray-800 rounded-lg px-3 py-1.5 disabled:opacity-50 transition duration-200"
        >
          {loading ? 'Cancellando...' : 'Sì, cancella'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1.5 transition duration-200"
        >
          No, torna indietro
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleCancel}
      className="text-xs text-red-500 border border-red-100 hover:bg-red-50 rounded-lg px-3 py-1.5"
    >
      Cancella prenotazione
    </button>
  )
}