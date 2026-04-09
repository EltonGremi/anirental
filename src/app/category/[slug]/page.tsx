import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, VEHICLE_CATEGORIES } from '@/lib/categories'
import { formatPrice } from '@/lib/format'
import VehicleFilters from '../../VehicleFilters'

export async function generateStaticParams() {
  return VEHICLE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', category.id)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-100/50 px-8 py-5 flex items-center justify-between transition-all duration-300">
        <Link href="/" className="text-2xl font-bold text-black tracking-tight hover:opacity-70 transition-opacity">
          AUTORENT
          <span className="text-zinc-400 font-normal ml-2 text-sm tracking-normal">ALBANIA</span>
        </Link>
        <Link href="/login" className="text-sm text-white bg-black hover:bg-zinc-800 shadow-sm hover:shadow-md rounded-full px-6 py-2.5 transition-all duration-300 font-medium">
          Hyr
        </Link>
      </header>

      {/* Hero */}
      <div className="bg-zinc-50 px-8 py-24 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-7xl mb-6 opacity-80">{category.icon}</div>
          <h1 className="text-5xl font-bold tracking-tighter text-black mb-4">
            {category.name.replace(/[^a-zA-Z\s]/g, '')}
          </h1>
          <p className="text-lg text-zinc-500 font-light max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-4 mb-4">
        <div className="text-sm text-zinc-400 font-medium tracking-wide flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors uppercase">
            Kryefaqja
          </Link>
          <span>/</span>
          <span className="text-black uppercase">{category.name.replace(/[^a-zA-Z\s]/g, '')}</span>
        </div>
      </div>

      {/* Catalogo */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {vehicles && vehicles.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-black tracking-tight mb-10">
              {vehicles.length} {vehicles.length === 1 ? 'mjet i disponueshëm' : 'mjete të disponueshme'}
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12 pl-4 pr-4 lg:pl-0 lg:pr-0">
              {vehicles.map((v) => (
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
          </>
        ) : (
          <div className="text-center py-24 bg-zinc-50 rounded-3xl mt-8">
            <p className="text-zinc-500 text-lg font-light mb-8">Nuk ka mjete të disponueshme në këtë kategori për momentin.</p>
            <Link href="/" className="btn-primary inline-block">
              ← Kthehu te Kryefaqja
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
