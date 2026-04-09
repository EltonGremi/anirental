'use client'

import Link from 'next/link'
import { VEHICLE_CATEGORIES } from '@/lib/categories'

export default function CategoryHero() {
  return (
    <div className="bg-white px-8 py-20 border-b border-zinc-100/50" id="kategori">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-2">
              Kategoritë e Mjeteve
            </h2>
            <p className="text-zinc-500 font-light text-lg">
              Eksploro flotën tonë sipas nevojave të tua
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {VEHICLE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="card-hover group border border-zinc-100 bg-zinc-50 hover:bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 h-full"
            >
              <div className="text-4xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform origin-left duration-300">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black mb-1">
                  {category.name.replace(/[^a-zA-Z\s]/g, '')}
                </h3>
                <p className="text-sm text-zinc-500 font-light line-clamp-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
