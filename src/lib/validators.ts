import { z } from 'zod'

/**
 * Validatori Zod per la sicurezza dell'input
 * Usati sia client-side (feedback UX) che server-side (sicurezza vera)
 */

// Telefono: 9+ cifre, può contenere spazi, dash, parentesi, +
export const phoneSchema = z
  .string()
  .min(9, 'Numero di telefono troppo corto (minimo 9 caratteri)')
  .max(20, 'Numero di telefono troppo lungo')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Formato numero non valido')
  .transform(val => val.trim())

// Data in formato YYYY-MM-DD
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido')
  .refine(val => !isNaN(new Date(val).getTime()), 'Data non valida')

// Note/commenti: max 500 caratteri, no HTML tags
export const noteSchema = z
  .string()
  .max(500, 'Massimo 500 caratteri')
  .regex(/^[^<>]*$/, 'Non sono permessi tag HTML')
  .optional()

// Rating per review: 1-5
export const ratingSchema = z
  .number()
  .int('Il rating deve essere un numero intero')
  .min(1, 'Il rating minimo è 1')
  .max(5, 'Il rating massimo è 5')

// Commento review: max 1000 caratteri
export const commentSchema = z
  .string()
  .max(1000, 'Massimo 1000 caratteri')
  .regex(/^[^<>]*$/, 'Non sono permessi tag HTML')
  .optional()

// Booking form validation
export const bookingSchema = z.object({
  vehicle_id: z.string().uuid('ID veicolo non valido'),
  client_id: z.string().uuid('ID cliente non valido'),
  start_date: dateSchema,
  end_date: dateSchema,
  phone_number: phoneSchema,
  notes: noteSchema,
  total_price: z.number().positive('Prezzo deve essere positivo'),
}).refine(
  data => new Date(data.start_date) < new Date(data.end_date),
  { message: 'Data inizio deve essere prima di fine', path: ['end_date'] }
)

// Review form validation
export const reviewSchema = z.object({
  vehicle_id: z.string().uuid('ID veicolo non valido'),
  author_id: z.string().uuid('ID autore non valido'),
  author_name: z.string().min(1).max(100),
  rating: ratingSchema,
  comment: commentSchema,
})

// Vehicle form validation
export const vehicleSchema = z.object({
  brand: z
    .string()
    .min(1, 'Marca obbligatoria')
    .max(50, 'Marca troppo lunga')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Caratteri non validi nella marca'),
  model: z
    .string()
    .min(1, 'Modello obbligatorio')
    .max(100, 'Modello troppo lungo')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Caratteri non validi nel modello'),
  plate: z
    .string()
    .min(6, 'Targa troppo corta')
    .max(10, 'Targa troppo lunga')
    .regex(/^[A-Z0-9\-]+$/, 'Formato targa non valido'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price_per_day: z.number().positive('Prezzo deve essere positivo'),
  latitude: z.number().min(-90).max(90, 'Latitudine non valida'),
  longitude: z.number().min(-180).max(180, 'Longitudine non valida'),
  description: z.string().max(2000).regex(/^[^<>]*$/, 'No HTML tags'),
})

// Location validation
export const locationSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitudine deve essere tra -90 e 90')
    .max(90, 'Latitudine deve essere tra -90 e 90'),
  longitude: z.number()
    .min(-180, 'Longitudine deve essere tra -180 e 180')
    .max(180, 'Longitudine deve essere tra -180 e 180'),
})
