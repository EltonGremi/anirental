'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
  vehicleId: string
  user: any
}

export default function ReviewForm({ vehicleId, user }: ReviewFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      alert('Devi essere loggato per lasciare una recensione')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('reviews').insert({
      vehicle_id: vehicleId,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email,
      rating,
      comment: comment || null,
    })

    setLoading(false)

    if (error) {
      alert('Errore: ' + error.message)
    } else {
      setSubmitted(true)
      setComment('')
      setRating(5)
      router.refresh()
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Lascia una recensione</h3>

      {!user ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
          Devi <a href="/login" className="font-medium underline">accedere</a> per lasciare una recensione.
        </div>
      ) : submitted ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
          ✅ Grazie per la tua recensione!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Valutazione</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? 'text-amber-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Commento (opzionale)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Condividi la tua esperienza..."
              maxLength={500}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-400 mt-1">{comment.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Invio...' : 'Invia recensione'}
          </button>
        </form>
      )}
    </div>
  )
}
