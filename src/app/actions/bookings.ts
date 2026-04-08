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

  // Prendi la prenotazione
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (!booking) return { error: 'Prenotazione non trovata' }

  // Cliente può cancellare solo le proprie prenotazioni
  if (!isAdmin && booking.client_id !== user.id) {
    return { error: 'Non autorizzato' }
  }

  // Non si può cancellare una prenotazione già completata
  if (booking.status === 'completed') {
    return { error: 'Non puoi cancellare una prenotazione completata' }
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