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
      <div className="max-w-2xl mx-auto px-8 py-12">
        <Badges badges={vehicle.badges} />
        <VideoPlayer url={vehicle.video_url} />
        <ImageGallery photos={vehicle.photos} />

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
            <p className="text-gray-500 mt-1">
              {vehicle.year} · {vehicle.seats} vende · {vehicle.transmission === 'manual' ? 'Manual' : 'Automatik'} · {vehicle.plate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{formatPrice(vehicle.daily_rate)} ALL</p>
            <p className="text-sm text-gray-400">në ditë</p>
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