import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import BookingForm from './BookingForm'
import ImageGallery from './ImageGallery'
import VideoPlayer from './VideoPlayer'
import Badges from './Badges'
import ReviewsList from './ReviewsList'
import ReviewForm from './ReviewForm'
import MapComponent from './MapComponent'

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (!vehicle) redirect('/')

  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookedDates } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('vehicle_id', id)
    .in('status', ['pending', 'confirmed', 'active'])

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('vehicle_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-semibold text-gray-900">AutoRent Albania</a>
        {user ? (
          <a href="/dashboard" className="text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2">Dashboard</a>
        ) : (
          <a href="/login" className="text-sm text-white bg-gray-900 rounded-lg px-4 py-2">Accedi</a>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <Badges badges={vehicle.badges} />
        <VideoPlayer url={vehicle.video_url} />
        <ImageGallery photos={vehicle.photos} />

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
            <p className="text-gray-500 mt-1">
              {vehicle.year} · {vehicle.seats} posti · {vehicle.transmission === 'manual' ? 'Manuale' : 'Automatico'} · {vehicle.plate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{formatPrice(vehicle.daily_rate)} ALL</p>
            <p className="text-sm text-gray-400">al giorno</p>
          </div>
        </div>

        <BookingForm
          vehicle={vehicle}
          user={user}
          bookedDates={bookedDates ?? []}
        />

        <ReviewsList reviews={reviews ?? []} />

        <ReviewForm vehicleId={id} user={user} />

        {vehicle.latitude && vehicle.longitude && (
          <MapComponent
            latitude={vehicle.latitude}
            longitude={vehicle.longitude}
            title={`${vehicle.brand} ${vehicle.model}`}
          />
        )}
      </div>
    </div>
  )
}