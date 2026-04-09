import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CancelButton from '../CancelButton'
import { formatPrice } from '@/lib/format'

const statusLabel: Record<string, string> = {
  pending: 'Në pritje',
  confirmed: 'Konfirmuar',
  active: 'Aktive',
  completed: 'Përfunduar',
  cancelled: 'Anuluar',
}

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-green-50 text-green-600',
  active: 'bg-blue-50 text-blue-600',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-500',
}

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      vehicle:vehicles(brand, model, plate),
      client:profiles!bookings_client_id_fkey(full_name, phone)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Rezervimet</h1>
            <p className="text-gray-500 text-sm mt-1">Të gjitha kërkesat e pranuara</p>
          </div>
          <Link href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-4 py-2">
            ← Paneli
          </Link>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {b.vehicle?.brand} {b.vehicle?.model} · {b.vehicle?.plate}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {b.client?.full_name} · {b.client?.phone ?? 'Pa telefon'}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                    {statusLabel[b.status]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Periudha</p>
                    <p className="text-gray-700">{b.start_date} → {b.end_date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Totali</p>
                    <p className="text-gray-700 font-medium">{formatPrice(b.total_price)} ALL</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Kërkuar më</p>
                    <p className="text-gray-700">
                      {new Date(b.created_at).toLocaleDateString('sq-AL')}
                    </p>
                  </div>
                </div>

                {b.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 mb-1">Shënime të klientit</p>
                    <p className="text-sm text-gray-600">{b.notes}</p>
                  </div>
                )}

                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <CancelButton bookingId={b.id} />
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400">Nuk ka rezervime akoma</p>
          </div>
        )}

      </div>
    </div>
  )
}