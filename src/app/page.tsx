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

      {/* Premium Hero Section */}
      <div className="relative bg-white pt-10 pb-20 lg:pt-0 lg:pb-0 overflow-hidden min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold tracking-wide uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              Flota Rinovuar 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold mb-6 tracking-tighter text-black leading-[1.05]">
              Merr Me Qira <br />
              Mjetin Tënd <br />
              <span className="text-zinc-400">Pa Stres.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-lg leading-relaxed font-light">
              Zbulo flotën tonë ekskluzive të makinave familjare dhe mjeteve të fuqishme. Performancë e lartë, rezervim i menjëhershëm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link href="/#kategori" className="btn-primary w-full sm:w-auto text-center">
                Eksploro Flotën
              </Link>
              <Link href="/login" className="btn-accent w-full sm:w-auto text-center">
                Zona e Rezervuar
              </Link>
            </div>

            {/* Premium Stats inline */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-zinc-100/60 max-w-lg">
              <div>
                <p className="text-3xl font-bold text-black mb-1 tracking-tight">500+</p>
                <p className="text-zinc-400 text-sm font-medium">Mjete Premium</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-black mb-1 tracking-tight">10k+</p>
                <p className="text-zinc-400 text-sm font-medium">Klientë të Kënaqur</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-black mb-1 tracking-tight">4.9</p>
                <p className="text-zinc-400 text-sm font-medium">Vlerësimi Mesatar</p>
              </div>
            </div>
          </div>

          {/* Right: Premium Image */}
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 rounded-3xl lg:rounded-none overflow-hidden mx-8 lg:mx-0 shadow-2xl lg:shadow-none">
            <img 
              src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop" 
              alt="Premium Car" 
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:hidden"></div>
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