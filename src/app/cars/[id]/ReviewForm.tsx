'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ratingSchema, commentSchema } from '@/lib/validators'

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
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!user) {
      alert('Duhet të jesh i kyçur për të lënë një vlerësim')
      return
    }

    // Validimi me Zod
    try {
      ratingSchema.parse(rating)
      commentSchema.parse(comment)
    } catch (err: any) {
      setError(err.message || 'Gabim validimi')
      return
    }

    setLoading(true)

    const { error: err } = await supabase.from('reviews').insert({
      vehicle_id: vehicleId,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email,
      rating,
      comment: comment || null,
    })

    setLoading(false)

    if (err) {
      setError('Gabim: ' + err.message)
    } else {
      setSubmitted(true)
      setComment('')
      setRating(5)
      router.refresh()
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-zinc-100 p-6 md:p-10 mb-8 flex flex-col gap-6 md:gap-8">
      <div className="border-b border-zinc-100 pb-4">
        <h3 className="text-xl md:text-2xl font-semibold text-black">⭐ Lër një vlerësim</h3>
      </div>

      {!user ? (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-amber-700">
          Duhet të <a href="/login" className="font-semibold underline">hysh</a> për të lënë një vlerësim.
        </div>
      ) : submitted ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-green-700 font-medium">
          ✅ Faleminderit për vlerësimin tënd!
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-5 text-sm md:text-base text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
          <div>
            <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-3 block">Vlerësimi</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl md:text-5xl transition-all hover:scale-110 active:scale-95 ${
                    star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-zinc-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Komenti (opsional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ndaj përvojën tënde..."
              maxLength={500}
              className="w-full bg-zinc-50 border-0 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-black outline-none transition-all resize-none"
              rows={4}
            />
            <p className="text-xs text-zinc-400 mt-2 font-light">{comment.length}/500 karaktere</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto self-start bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full px-8 py-4 text-base md:text-lg font-medium transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]"
          >
            {loading ? 'Duke dërguar...' : 'Dërgo vlerësimin'}
          </button>
          </form>
        </>
      )}
    </div>
  )
}
