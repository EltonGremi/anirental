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
              {isAdmin ? 'Pannello Admin' : 'Le mie prenotazioni'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {profile?.full_name} · {isAdmin ? 'Amministratore' : 'Cliente'}
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-4 py-2">
              Esci
            </button>
          </form>
        </div>

        {isAdmin ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Prenotazioni pending</p>
                <p className="text-3xl font-semibold text-amber-500">{pendingCount ?? 0}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Confermate</p>
                <p className="text-3xl font-semibold text-green-500">{confirmedCount ?? 0}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-1">Auto disponibili</p>
                <p className="text-3xl font-semibold text-blue-500">{vehiclesCount ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/vehicles"
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition">
                <p className="font-medium text-gray-900 mb-1">Gestisci veicoli</p>
                <p className="text-sm text-gray-500">Aggiungi, modifica o rimuovi auto dal parco</p>
              </Link>
              <Link href="/dashboard/bookings"
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition">
                <p className="font-medium text-gray-900 mb-1">Prenotazioni</p>
                <p className="text-sm text-gray-500">Visualizza e gestisci tutte le prenotazioni</p>
              </Link>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Le mie prenotazioni</h2>
            <ClientBookings userId={user.id} />
          </div>
        )}

      </div>
    </div>
  )
}