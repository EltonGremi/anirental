import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import VehicleFilters from './VehicleFilters'
import CategoryHero from './CategoryHero'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">AutoRent Albania</h1>
        <Link href="/login"
          className="text-sm text-white bg-gray-900 hover:bg-gray-700 rounded-lg px-4 py-2">
          Accedi
        </Link>
      </header>

      {/* Hero */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight text-gray-900">
            Noleggia il Tuo Veicolo
          </h1>
          <p className="text-sm text-gray-600 mb-3">
            Auto familiari e mezzi da lavoro
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/#categorie" className="btn-accent text-sm py-2 px-4">
              Esplora Ora
            </a>
            <a href="/login" className="btn-primary text-sm py-2 px-4">
              Accedi
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">500+</p>
            <p className="text-gray-600 text-xs">Veicoli</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">10k+</p>
            <p className="text-gray-600 text-xs">Clienti</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">4.9★</p>
            <p className="text-gray-600 text-xs">Rating</p>
          </div>
        </div>
      </div>

      {/* Categorie */}
      <CategoryHero />

      {/* Catalogo */}
      <div className="max-w-4xl mx-auto px-8 py-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">Auto disponibili</h3>
        <VehicleFilters vehicles={vehicles ?? []} />
      </div>

    </div>
  )
}