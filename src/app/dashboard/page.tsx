import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClientBookings from './ClientBookings'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const [
    { count: pendingCount },
    { count: confirmedCount },
    { count: vehiclesCount },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'available'),
  ])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isAdmin ? 'Paneli i Adminit' : 'Rezervimet e mia'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {profile?.full_name} · {isAdmin ? 'Administrator' : 'Klient'}
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-4 py-2">
              Dil
            </button>
          </form>
        </div>

        {isAdmin ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Rezervime në pritje</p>
                <p className="text-3xl font-semibold text-amber-500">{pendingCount ?? 0}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Konfirmuara</p>
                <p className="text-3xl font-semibold text-green-500">{confirmedCount ?? 0}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Makina të disponueshme</p>
                <p className="text-3xl font-semibold text-blue-500">{vehiclesCount ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/vehicles"
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition">
                <p className="font-medium text-gray-900 mb-1">Menaxho mjetet</p>
                <p className="text-sm text-gray-500">Shto, modifiko ose hiq makina nga flota</p>
              </Link>
              <Link href="/dashboard/bookings"
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition">
                <p className="font-medium text-gray-900 mb-1">Rezervimet</p>
                <p className="text-sm text-gray-500">Shiko dhe menaxho të gjitha rezervimet</p>
              </Link>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Rezervimet e mia</h2>
            <ClientBookings userId={user.id} />
          </div>
        )}

      </div>
    </div>
  )
}