export default function ReviewsList({ reviews }: { reviews?: any[] }) {
  if (!reviews?.length) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 mb-8">
        <p>Nuk ka vlerësime akoma. Bëhu i pari! ⭐</p>
      </div>
    )
  }

  const avgRating = (
    reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviews.length
  ).toFixed(1)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Vlerësimet</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(Number(avgRating))
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{review.author_name}</p>
                <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('sq-AL')}</p>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= review.rating ? 'text-amber-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
