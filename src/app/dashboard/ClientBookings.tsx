import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format'
import CancelButton from './CancelButton'

const statusLabel: Record<string, string> = {
  pending: 'In attesa di conferma',
  confirmed: 'Confermata',
  active: 'In corso',
  completed: 'Completata',
  cancelled: 'Annullata',
}

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-green-50 text-green-600',
  active: 'bg-blue-50 text-blue-600',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-500',
}

export default async function ClientBookings({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      vehicle:vehicles(brand, model, plate, photos)
    `)
    .eq('client_id', userId)
    .order('created_at', { ascending: false })

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-400 mb-4">Non hai ancora prenotazioni</p>
        <a href="/"
          className="text-sm text-white bg-gray-900 hover:bg-gray-700 rounded-lg px-4 py-2">
          Sfoglia le auto →
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((b) => (
        <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            {b.vehicle?.photos?.[0] ? (
              <img src={b.vehicle.photos[0]} alt={b.vehicle.model}
                className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-24 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                No foto
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-gray-900">
                  {b.vehicle?.brand} {b.vehicle?.model} · {b.vehicle?.plate}
                </p>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                  {statusLabel[b.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {b.start_date} → {b.end_date}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(b.total_price)} ALL
                </p>
                <p className="text-xs text-gray-400">
                  Richiesta il {new Date(b.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>

              {b.status === 'pending' && (
                <div className="mt-3 bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-700">
                  In attesa di conferma — verrai contattato via Telegram o telefono
                </div>
              )}
              {b.status === 'confirmed' && (
                <div className="mt-3 bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700">
                  Prenotazione confermata — ci vediamo al ritiro!
                </div>
              )}

              {b.status !== 'cancelled' && b.status !== 'completed' && (
                <div className="mt-3">
                  <CancelButton bookingId={b.id} />
                </div>
              )}

            </div>
          </div>
        </div>
      ))}
    </div>
  )
}