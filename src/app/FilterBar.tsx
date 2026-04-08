'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/format'

interface FilterBarProps {
  brands: string[]
  minPrice: number
  maxPrice: number
  onFilter: (filters: {
    brand: string
    minPrice: number
    maxPrice: number
    transmission: string
  }) => void
}

export default function FilterBar({ brands, minPrice, maxPrice, onFilter }: FilterBarProps) {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState(maxPrice)
  const [transmission, setTransmission] = useState('')

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value
    setSelectedBrand(brand)
    onFilter({ brand, minPrice, maxPrice: priceRange, transmission })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(e.target.value)
    setPriceRange(price)
    onFilter({ brand: selectedBrand, minPrice, maxPrice: price, transmission })
  }

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const trans = e.target.value
    setTransmission(trans)
    onFilter({ brand: selectedBrand, minPrice, maxPrice: priceRange, transmission: trans })
  }

  const resetFilters = () => {
    setSelectedBrand('')
    setPriceRange(maxPrice)
    setTransmission('')
    onFilter({ brand: '', minPrice, maxPrice, transmission: '' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtra auto</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Marca */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Marca</label>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
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
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={handlePriceChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">fino {formatPrice(priceRange)} ALL/giorno</p>
          </div>
        </div>

        {/* Trasmissione */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Trasmissione</label>
          <select
            value={transmission}
            onChange={handleTransmissionChange}
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
            onClick={resetFilters}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            Cancella filtri
          </button>
        </div>
      </div>
    </div>
  )
}
