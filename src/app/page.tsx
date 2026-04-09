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
    <div className="w-full flex-col flex bg-gray-50">

      {/* Hero */}
      <div className="relative bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900 drop-shadow-sm">
            Merr Me Qira Mjetin Tënd <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
              Pa Stres
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Zbulo flotën tonë të makinave familjare dhe mjeteve të punës. Modele të reja, rezervim i lehtë dhe vlerësime të verifikuara.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link href="/#kategori" className="btn-accent shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 py-3 px-8 rounded-xl font-medium">
              Eksploro Flotën
            </Link>
            <Link href="/login" className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm transition-all duration-300 py-3 px-8 rounded-xl font-medium">
              Zona e Rezervuar
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">500+</p>
            <p className="text-gray-600 text-xs">Mjete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">10k+</p>
            <p className="text-gray-600 text-xs">Klientë</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900 mb-0.5">4.9★</p>
            <p className="text-gray-600 text-xs">Vlerësimi</p>
          </div>
        </div>
      </div>

      {/* Kategoritë */}
      <CategoryHero />

      {/* Katalog */}
      <div className="max-w-4xl mx-auto px-8 py-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">Makina të disponueshme</h3>
        <VehicleFilters vehicles={vehicles ?? []} />
      </div>

    </div>
  )
}