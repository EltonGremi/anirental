import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCategoryById } from '@/lib/categories'

export default async function VehiclesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Mjetet</h1>
            <p className="text-gray-500 text-sm mt-1">Menaxho flotën tënde</p>
          </div>
          <Link
            href="/dashboard/vehicles/new"
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            + Shto mjet
          </Link>
        </div>

        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {vehicles.map((v) => {
              const category = getCategoryById(v.category || 'familje')
              return (
                <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {v.photos?.[0] ? (
                      <img src={v.photos[0]} alt={v.model} className="w-16 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Pa foto
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{v.brand} {v.model}</p>
                      <p className="text-sm text-gray-500">
                        {v.plate} · {v.year} · {category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">{v.daily_rate} ALL<span className="text-gray-400 font-normal">/ditë</span></p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      v.status === 'available'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {v.status === 'available' ? 'I disponueshëm' : 'Jo i disponueshëm'}
                    </span>
                    <Link
                      href={`/dashboard/vehicles/${v.id}`}
                      className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1"
                    >
                      Modifiko
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-500 text-sm mb-4">Nuk ka mjete akoma. Shto të parin!</p>
            <Link
              href="/dashboard/vehicles/new"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-700 transition"
            >
              + Shto mjet
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}