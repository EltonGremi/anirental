import { createClient } from 'jsr:@supabase/supabase-js@2'

const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

// Escape HTML to prevent XSS in email templates
function escapeHtml(text: string | null | undefined): string {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .substring(0, 500) // Limit length against DOS
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'AutoRent Albania <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  })
}

Deno.serve(async (req) => {
  const body = await req.json()

  if (!body.callback_query) {
    return new Response('ok', { status: 200 })
  }

  const callback = body.callback_query
  const data = callback.data as string
  const chatId = callback.message.chat.id
  const messageId = callback.message.message_id

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Rispondi subito a Telegram
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callback.id }),
  })

  if (data.startsWith('confirm_')) {
    const bookingId = data.replace('confirm_', '')

    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(brand, model, plate),
        client:profiles!bookings_client_id_fkey(full_name, phone)
      `)
      .eq('id', bookingId)
      .single()

    // Aggiorna stato
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    // Prendi email del cliente
    const { data: authUser } = await supabase.auth.admin.getUserById(booking.client_id)
    const clientEmail = authUser.user?.email

    // Manda email di conferma - SAFE: dati escapati contro XSS
    if (clientEmail) {
      await sendEmail(
        clientEmail,
        '✅ Prenotazione confermata — AutoRent Albania',
        `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #111; margin-bottom: 8px;">Prenotazione confermata!</h2>
          <p style="color: #666; margin-bottom: 24px;">Ciao ${escapeHtml(booking?.client?.full_name)}, la tua prenotazione è stata confermata.</p>

          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px;"><strong>Auto:</strong> ${escapeHtml(booking?.vehicle?.brand)} ${escapeHtml(booking?.vehicle?.model)} · ${escapeHtml(booking?.vehicle?.plate)}</p>
            <p style="margin: 0 0 8px; font-size: 14px;"><strong>Periodo:</strong> ${booking?.start_date} → ${booking?.end_date}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Totale:</strong> ${booking?.total_price?.toLocaleString()} ALL</p>
          </div>

          <p style="color: #666; font-size: 14px;">Ci vediamo al ritiro! Per qualsiasi domanda contattaci su Telegram.</p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">AutoRent Albania</p>
        </div>
        `
      )

      // Log email
      await supabase.from('notifications_log').insert({
        booking_id: bookingId,
        channel: 'email',
        event: 'confirmed',
        status: 'sent',
      })
    }

    // Log Telegram
    await supabase.from('notifications_log').insert({
      booking_id: bookingId,
      channel: 'telegram',
      event: 'confirmed',
      status: 'sent',
    })

    // Aggiorna messaggio Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: `✅ *Prenotazione CONFERMATA*\n\n👤 ${booking?.client?.full_name}\n🚙 ${booking?.vehicle?.brand} ${booking?.vehicle?.model}\n📅 ${booking?.start_date} → ${booking?.end_date}\n💰 ${booking?.total_price?.toLocaleString()} ALL\n\n📧 Email inviata al cliente`,
        parse_mode: 'Markdown',
      }),
    })

  } else if (data.startsWith('reject_')) {
    const bookingId = data.replace('reject_', '')

    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(brand, model, plate),
        client:profiles!bookings_client_id_fkey(full_name, phone)
      `)
      .eq('id', bookingId)
      .single()

    // Aggiorna stato
    await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    // Prendi email del cliente
    const { data: authUser } = await supabase.auth.admin.getUserById(booking.client_id)
    const clientEmail = authUser.user?.email

    // Manda email di rifiuto
    if (clientEmail) {
      await sendEmail(
        clientEmail,
        '❌ Prenotazione non disponibile — AutoRent Albania',
        `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #111; margin-bottom: 8px;">Prenotazione non disponibile</h2>
          <p style="color: #666; margin-bottom: 24px;">Ciao ${booking?.client?.full_name}, purtroppo non possiamo confermare la tua richiesta per il periodo selezionato.</p>

          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px;"><strong>Auto:</strong> ${booking?.vehicle?.brand} ${booking?.vehicle?.model}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Periodo richiesto:</strong> ${booking?.start_date} → ${booking?.end_date}</p>
          </div>

          <p style="color: #666; font-size: 14px;">Puoi scegliere un altro periodo o un'altra auto disponibile sul sito.</p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">AutoRent Albania</p>
        </div>
        `
      )

      // Log email
      await supabase.from('notifications_log').insert({
        booking_id: bookingId,
        channel: 'email',
        event: 'cancelled',
        status: 'sent',
      })
    }

    // Log Telegram
    await supabase.from('notifications_log').insert({
      booking_id: bookingId,
      channel: 'telegram',
      event: 'cancelled',
      status: 'sent',
    })

    // Aggiorna messaggio Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: `❌ *Prenotazione RIFIUTATA*\n\n👤 ${booking?.client?.full_name}\n🚙 ${booking?.vehicle?.brand} ${booking?.vehicle?.model}\n📅 ${booking?.start_date} → ${booking?.end_date}\n\n📧 Email inviata al cliente`,
        parse_mode: 'Markdown',
      }),
    })
  }

  return new Response('ok', { status: 200 })
})