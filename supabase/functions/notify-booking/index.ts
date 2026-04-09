import { createClient } from 'jsr:@supabase/supabase-js@2'

const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!

// Escape special Markdown characters to prevent injection attacks
function escapeMarkdown(text: string | null | undefined): string {
  if (!text) return 'N/D'
  return String(text)
    .replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&')
    .substring(0, 500) // Limit length against DOS
}

Deno.serve(async (req) => {
  const payload = await req.json()
  const booking = payload.record

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Prendi i dati del veicolo e del cliente
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('brand, model, plate')
    .eq('id', booking.vehicle_id)
    .single()

  const { data: client } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', booking.client_id)
    .single()

  // Calcola i giorni
  const start = new Date(booking.start_date)
  const end = new Date(booking.end_date)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // Messaggio Telegram - SAFE: valori escapati per evitare injection
  const message = `
🚗 *Nuova richiesta prenotazione*

👤 *Cliente*
${escapeMarkdown(client?.full_name)}

📞 *Numero di telefono*
[RISERVATO - Vedi email]

🚙 *Auto*
${escapeMarkdown(vehicle?.brand)} ${escapeMarkdown(vehicle?.model)} · ${escapeMarkdown(vehicle?.plate)}

📅 *Periodo*
${booking.start_date} → ${booking.end_date} · ${days} giorni

💰 *Totale stimato*
${booking.total_price?.toLocaleString()} ALL

${booking.notes ? `📝 *Note*\n${escapeMarkdown(booking.notes)}` : ''}
  `.trim()

  // Bottoni inline
  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Conferma', callback_data: `confirm_${booking.id}` },
      { text: '❌ Rifiuta', callback_data: `reject_${booking.id}` },
    ]]
  }

  // Invia messaggio Telegram
  const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }),
  })

  const tgData = await tgRes.json()

  // Salva il message_id nel booking
  if (tgData.ok) {
    await supabase
      .from('bookings')
      .update({ tg_message_id: tgData.result.message_id })
      .eq('id', booking.id)

    // Log notifica
    await supabase.from('notifications_log').insert({
      booking_id: booking.id,
      channel: 'telegram',
      event: 'new',
      status: 'sent',
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})