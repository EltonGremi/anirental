import { z } from 'zod'

/**
 * Validatorë Zod për sigurinë të input-it
 * Përdoren si client-side (feedback UX) ashtu edhe server-side (siguri reale)
 */

// Telefon: 9+ shifra, mund të përmbajë hapësira, viza, kllapa, +
export const phoneSchema = z
  .string()
  .min(9, 'Numri i telefonit është shumë i shkurtër (minimum 9 karaktere)')
  .max(20, 'Numri i telefonit është shumë i gjatë')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Formati i numrit nuk është i vlefshëm')
  .transform(val => val.trim())

// Datë në formatin YYYY-MM-DD
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formati i datës nuk është i vlefshëm')
  .refine(val => !isNaN(new Date(val).getTime()), 'Datë e pavlefshme')

// Shënime/komente: maksimumi 500 karaktere, pa tag HTML
export const noteSchema = z
  .string()
  .max(500, 'Maksimumi 500 karaktere')
  .regex(/^[^<>]*$/, 'Nuk lejohen tag-e HTML')
  .optional()

// Vlerësim për review: 1-5
export const ratingSchema = z
  .number()
  .int('Vlerësimi duhet të jetë numër i plotë')
  .min(1, 'Vlerësimi minimal është 1')
  .max(5, 'Vlerësimi maksimal është 5')

// Koment review: maksimumi 1000 karaktere
export const commentSchema = z
  .string()
  .max(1000, 'Maksimumi 1000 karaktere')
  .regex(/^[^<>]*$/, 'Nuk lejohen tag-e HTML')
  .optional()

// Validimi i formës së rezervimit
export const bookingSchema = z.object({
  vehicle_id: z.string().uuid('ID e mjetit nuk është e vlefshme'),
  client_id: z.string().uuid('ID e klientit nuk është e vlefshme'),
  start_date: dateSchema,
  end_date: dateSchema,
  phone_number: phoneSchema,
  notes: noteSchema,
  total_price: z.number().positive('Çmimi duhet të jetë pozitiv'),
}).refine(
  data => new Date(data.start_date) < new Date(data.end_date),
  { message: 'Data e fillimit duhet të jetë para datës së përfundimit', path: ['end_date'] }
)

// Validimi i formës së vlerësimit
export const reviewSchema = z.object({
  vehicle_id: z.string().uuid('ID e mjetit nuk është e vlefshme'),
  author_id: z.string().uuid('ID e autorit nuk është e vlefshme'),
  author_name: z.string().min(1).max(100),
  rating: ratingSchema,
  comment: commentSchema,
})

// Validimi i formës së mjetit
export const vehicleSchema = z.object({
  brand: z
    .string()
    .min(1, 'Marka është e detyrueshme')
    .max(50, 'Marka është shumë e gjatë')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Karaktere të pavlefshme në markë'),
  model: z
    .string()
    .min(1, 'Modeli është i detyrueshëm')
    .max(100, 'Modeli është shumë i gjatë')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Karaktere të pavlefshme në model'),
  plate: z
    .string()
    .min(6, 'Targa është shumë e shkurtër')
    .max(10, 'Targa është shumë e gjatë')
    .regex(/^[A-Z0-9\-]+$/, 'Formati i targës nuk është i vlefshëm'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price_per_day: z.number().positive('Çmimi duhet të jetë pozitiv'),
  latitude: z.number().min(-90).max(90, 'Gjerësia gjeografike nuk është e vlefshme'),
  longitude: z.number().min(-180).max(180, 'Gjatësia gjeografike nuk është e vlefshme'),
  description: z.string().max(2000).regex(/^[^<>]*$/, 'Nuk lejohen tag-e HTML'),
})

// Validimi i vendndodhjes
export const locationSchema = z.object({
  latitude: z.number()
    .min(-90, 'Gjerësia gjeografike duhet të jetë midis -90 dhe 90')
    .max(90, 'Gjerësia gjeografike duhet të jetë midis -90 dhe 90'),
  longitude: z.number()
    .min(-180, 'Gjatësia gjeografike duhet të jetë midis -180 dhe 180')
    .max(180, 'Gjatësia gjeografike duhet të jetë midis -180 dhe 180'),
})
