'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Merr rezervimin
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (!booking) return { error: 'Rezervimi nuk u gjet' }

  // Klienti mund të anulojë vetëm rezervimet e veta
  if (!isAdmin && booking.client_id !== user.id) {
    return { error: 'Jo i autorizuar' }
  }

  // Nuk mund të anulohet një rezervim i përfunduar
  if (booking.status === 'completed') {
    return { error: 'Nuk mund të anulosh një rezervim të përfunduar' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/bookings')

  return { ok: true }
}