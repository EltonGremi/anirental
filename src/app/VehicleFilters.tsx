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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredVehicles.map((v) => (
            <Link
              key={v.id}
              href={`/cars/${v.id}`}
              className="card-hover group overflow-hidden bg-white"
            >
              <div className="relative overflow-hidden h-48">
                {v.photos?.[0] ? (
                  <img 
                    src={v.photos[0]} 
                    alt={v.model} 
                    className="w-full h-full object-cover transition duration-300" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Nuk ka foto
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {v.year} · {v.seats} vende · {v.transmission === 'manual' ? 'Manual' : 'Automatik'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(v.daily_rate)} ALL</p>
                  <p className="text-xs text-gray-400">në ditë</p>
                </div>

                <button className="btn-primary w-full py-2 text-sm">
                  Rezervo
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-base">Nuk u gjet asnjë mjet</p>
          <p className="text-gray-400 text-sm mt-1">Ndrysho kriteret e kërkimit</p>
        </div>
      )}
    </>
  )
}
