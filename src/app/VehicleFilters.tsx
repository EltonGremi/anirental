'use client'

import { useState, useMemo } from 'react'
import FilterBar from './FilterBar'
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

  // Estrai le marche disponibili
  const brands = Array.from(new Set(vehicles.map((v) => v.brand)))

  // Filtra i veicoli in base ai filtri selezionati
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtra veicoli</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Categoria */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Categoria</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tutte le categorie</option>
              {VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marca */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Marca</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tutte le marche</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Prezzo massimo */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Prezzo massimo</label>
            <div>
              <input
                type="range"
                min={filters.minPrice}
                max={10000}
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">fino {formatPrice(filters.maxPrice)} ALL/giorno</p>
            </div>
          </div>

          {/* Trasmissione */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Trasmissione</label>
            <select
              value={filters.transmission}
              onChange={(e) => setFilters({...filters, transmission: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tutte</option>
              <option value="manual">Manuale</option>
              <option value="automatic">Automatico</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => setFilters({brand: '', minPrice: 0, maxPrice: 10000, transmission: '', category: ''})}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium transition"
            >
              Cancella filtri
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
                    Nessuna foto
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {v.year} · {v.seats} posti · {v.transmission === 'manual' ? 'Manuale' : 'Automatico'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(v.daily_rate)} ALL</p>
                  <p className="text-xs text-gray-400">al giorno</p>
                </div>

                <button className="btn-primary w-full py-2 text-sm">
                  Prenota
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-base">Nessun veicolo trovato</p>
          <p className="text-gray-400 text-sm mt-1">Modifica i tuoi criteri di ricerca</p>
        </div>
      )}
    </>
  )
}
