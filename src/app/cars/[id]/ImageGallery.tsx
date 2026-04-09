'use client'

import { useState } from 'react'

export default function ImageGallery({ photos }: { photos?: string[] }) {
  const [current, setCurrent] = useState(0)

  if (!photos?.length) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-8">
        Nuk ka foto të disponueshme
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % photos.length)
  }

  return (
    <div className="mb-8">
      {/* Main Image */}
      <div className="relative mb-4">
        <img
          src={photos[current]}
          alt={`Foto ${current + 1}`}
          className="w-full h-64 object-cover rounded-2xl"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
              aria-label="Foto e mëparshme"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
              aria-label="Foto tjetër"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Counter */}
            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {current + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                index === current ? 'border-gray-900' : 'border-gray-200'
              }`}
              aria-label={`Shko te foto ${index + 1}`}
            >
              <img src={photo} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
