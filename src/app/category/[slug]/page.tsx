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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-gray-900">
          AutoRent Albania
        </Link>
        <Link href="/login" className="text-sm text-white bg-gray-900 hover:bg-gray-700 rounded-lg px-4 py-2">
          Hyr
        </Link>
      </header>

      {/* Hero */}
      <div className={`${category.color} ${category.textColor} px-8 py-16`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-lg opacity-75">{category.description}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Kryefaqja
          </Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </div>
      </div>

      {/* Catalogo */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {vehicles && vehicles.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {vehicles.length} {vehicles.length === 1 ? 'mjet i disponueshëm' : 'mjete të disponueshme'}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {vehicles.map((v) => (
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">Nuk ka mjete të disponueshme në këtë kategori për momentin.</p>
            <Link href="/" className="text-gray-900 font-medium hover:underline">
              ← Kthehu te kryefaqja
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
