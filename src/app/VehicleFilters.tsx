'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { VEHICLE_CATEGORIES } from '@/lib/categories'
import { formatPrice } from '@/lib/format'

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  seats: number
  transmission: 'manual' | 'automatic'
  daily_rate: number
  category?: string
  photos?: string[]
}

interface VehicleFiltersProps {
  vehicles: Vehicle[]
}

export default function VehicleFilters({ vehicles }: VehicleFiltersProps) {
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    transmission: '',
    category: '',
  })

  // Nxirr markat e disponueshme
  const brands = Array.from(new Set(vehicles.map((v) => v.brand)))

  // Filtro mjetet sipas filtrave të zgjedhura
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.brand && v.brand !== filters.brand) return false
      if (v.daily_rate > filters.maxPrice) return false
      if (filters.transmission && v.transmission !== filters.transmission) return false
      if (filters.category && v.category !== filters.category) return false
      return true
    })
  }, [vehicles, filters])

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtro mjetet</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Kategoria */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Kategoria</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Të gjitha kategoritë</option>
              {VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marka */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Marka</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Të gjitha markat</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Çmimi maksimal */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Çmimi maksimal</label>
            <div>
              <input
                type="range"
                min={filters.minPrice}
                max={10000}
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">deri {formatPrice(filters.maxPrice)} ALL/ditë</p>
            </div>
          </div>

          {/* Transmetimi */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Transmetimi</label>
            <select
              value={filters.transmission}
              onChange={(e) => setFilters({...filters, transmission: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Të gjitha</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatik</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => setFilters({brand: '', minPrice: 0, maxPrice: 10000, transmission: '', category: ''})}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium transition"
            >
              Pastro filtrat
            </button>
          </div>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
          {filteredVehicles.map((v) => (
            <Link
              key={v.id}
              href={`/cars/${v.id}`}
              className="card-hover group flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden h-64 rounded-t-3xl bg-zinc-50">
                  {v.photos?.[0] ? (
                    <img 
                      src={v.photos[0]} 
                      alt={v.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm font-light uppercase tracking-widest">
                      Nuk ka foto
                    </div>
                  )}
                </div>
                
                <div className="p-6 pb-2">
                  <div className="mb-4">
                    <p className="text-xl font-bold text-black tracking-tight uppercase">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-sm text-zinc-500 font-light mt-1 flex items-center gap-2">
                      <span>{v.year}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                      <span>{v.seats} vende</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                      <span>{v.transmission === 'manual' ? 'Manual' : 'Automatik'}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6 mt-auto">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-black tracking-tighter">{formatPrice(v.daily_rate)} ALL</p>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-0.5">/ në ditë</p>
                  </div>
                </div>

                <div className="w-full bg-black text-white text-center py-3.5 rounded-full font-medium text-sm hover:bg-zinc-800 transition-colors">
                  Rezervo Tani
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-50 rounded-3xl">
          <p className="text-zinc-500 text-lg font-light">Nuk u gjet asnjë mjet</p>
          <p className="text-zinc-400 text-sm mt-2">Ndrysho kriteret e kërkimit për më shumë rezultate.</p>
        </div>
      )}
    </>
  )
}
