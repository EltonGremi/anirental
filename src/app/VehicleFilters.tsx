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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeTag, setActiveTag] = useState<string>('')

  // Definizione dei Quick Filters divisi per categoria principale
  const getQuickFilters = (categoryId: string) => {
    switch (categoryId) {
      case 'gruppo-auto':
        return ['Moto/Scooter', 'SUV', '5 Porte', 'Manuale', 'Automatik']
      case 'gruppo-trasporto':
        return ['Trasporto Persone', 'Trasporto Merci']
      case 'gruppo-speciali':
        return ['Camper', 'Camion', 'Trasporto Inerti', 'Escavatori']
      default:
        // Filtri veloci globali se nessuna categoria è selezionata
        return ['SUV', 'Automatik', 'Familjare', 'Furgon']
    }
  }

  // Funzione helper per verificare se il veicolo matcha il tag speciale
  const vehicleMatchesTag = (v: Vehicle, tag: string) => {
    const t = tag.toLowerCase()
    const str = `${v.brand} ${v.model} ${v.category} ${v.transmission}`.toLowerCase()
    
    if (t === '5 porte' || t === 'sf') return v.seats >= 4 // approssimazione
    if (t === 'trasporto persone') return v.seats > 5 // approssimazione per furgoni passeggeri
    if (str.includes(t)) return true
    return false
  }

  // Filtro mjetet
  const filteredVehicles = useMemo(() => {
    let result = vehicles

    // Filtro per macro-categoria (se leccata la linguetta in alto)
    if (activeCategory) {
      result = result.filter(v => v.category === activeCategory)
    }

    // Filtro per barra di ricerca (tutto testo libero)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(v => {
        const fullString = `${v.brand} ${v.model} ${v.year} ${v.seats} vende ${v.transmission} ${v.category}`.toLowerCase()
        // Cerca che tutte le parole chiave siano presenti
        return q.split(' ').every(word => fullString.includes(word))
      })
    }

    // Filtro per Tag Rapido
    if (activeTag) {
      result = result.filter(v => vehicleMatchesTag(v, activeTag))
    }

    return result
  }, [vehicles, searchQuery, activeCategory, activeTag])

  const quickFilters = getQuickFilters(activeCategory)

  return (
    <>
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8 mb-12">
        
        {/* Category Cards (Acts like a select) */}
        <div className="mb-8">
          <label className="text-sm font-medium text-zinc-500 mb-4 block uppercase tracking-wider">Zgjidh Kategorinë</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VEHICLE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    // Se clicco la card già attiva, rimuovo il filtro (mostro tutto)
                    setActiveCategory(isActive ? '' : cat.id);
                    setActiveTag('');
                  }}
                  className={`card-hover group cursor-pointer border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 h-full ${
                    isActive 
                      ? 'border-black bg-black text-white shadow-xl scale-[1.02]' 
                      : 'border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-300 text-black'
                  }`}
                >
                  <div className={`text-4xl mb-6 transition-transform duration-300 ${!isActive && 'group-hover:scale-110 opacity-80 group-hover:opacity-100'}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg mb-1 ${isActive ? 'text-white' : 'text-black'}`}>
                      {cat.name.replace(/[^a-zA-Z\s,]/g, '')}
                    </h3>
                    <p className={`text-sm font-light line-clamp-2 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Free Text Search Bar */}
        <div className="relative mb-6">
          <label className="text-sm font-medium text-zinc-500 mb-2 block uppercase tracking-wider">Kërkim Personalizuar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="text-xl opacity-40">🔍</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca veicolo (es. automatico, basso consumo, 5 posti...)"
              className="w-full bg-zinc-50 border-0 rounded-2xl py-4 pl-16 pr-6 text-lg text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>
        </div>

        {/* Quick Filters Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider mr-2">Filtra të Shpejta:</span>
          {quickFilters.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                activeTag === tag 
                  ? 'border-black bg-black text-white shadow-md' 
                  : 'border-zinc-200 text-zinc-600 bg-white hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {tag}
            </button>
          ))}
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
