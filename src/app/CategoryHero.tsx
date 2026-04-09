'use client'

import Link from 'next/link'
import { VEHICLE_CATEGORIES } from '@/lib/categories'

export default function CategoryHero() {
  return (
    <div className="bg-white px-8 py-4 border-b border-gray-200" id="kategori">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Zgjidh Kategorinë Tënde
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Gjej mjetin perfekt për nevojat e tua
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {VEHICLE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="card-hover group"
            >
              <div className={`${category.color} ${category.textColor} rounded-xl p-4 text-center h-full flex flex-col justify-between`}>
                <div className="text-3xl mb-2">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xs mb-0.5 line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs opacity-75 line-clamp-1">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
