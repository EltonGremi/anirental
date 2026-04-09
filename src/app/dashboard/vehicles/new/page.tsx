'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import LocationPicker from '../LocationPicker'
import { VEHICLE_CATEGORIES } from '@/lib/categories'
import { vehicleSchema } from '@/lib/validators'

export default function NewVehiclePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    brand: '',
    model: '',
    plate: '',
    year: '',
    seats: '',
    transmission: 'manual',
    daily_rate: '',
    category: 'famiglia',
    latitude: 40.748305,
    longitude: 19.649150,
  })

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage
      .from('vehicles')
      .upload(fileName, file)
    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(data.path)
      setPhotoUrl(urlData.publicUrl)
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validazione con Zod
    try {
      vehicleSchema.parse({
        brand: form.brand,
        model: form.model,
        plate: form.plate.toUpperCase(),
        year: parseInt(form.year),
        price_per_day: parseFloat(form.daily_rate),
        latitude: form.latitude,
        longitude: form.longitude,
        description: '',
      })
    } catch (err: any) {
      setError(err.message || 'Errore di validazione')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('vehicles').insert({
      brand: form.brand,
      model: form.model,
      plate: form.plate.toUpperCase(),
      year: parseInt(form.year),
      seats: parseInt(form.seats),
      transmission: form.transmission,
      daily_rate: parseFloat(form.daily_rate),
      category: form.category,
      latitude: form.latitude,
      longitude: form.longitude,
      photos: photoUrl ? [photoUrl] : [],
      status: 'available',
    })
    
    setLoading(false)
    
    if (error) {
      setError('Errore: ' + error.message)
    } else {
      router.push('/dashboard/vehicles')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nuovo veicolo</h1>
        <p className="text-gray-500 text-sm mb-8">Compila i dati del veicolo</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Marca</label>
              <input
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.brand}
                onChange={e => setForm({...form, brand: e.target.value})}
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Modello</label>
              <input
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.model}
                onChange={e => setForm({...form, model: e.target.value})}
                placeholder="Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Targa</label>
              <input
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.plate}
                onChange={e => setForm({...form, plate: e.target.value})}
                placeholder="AA 123 BB"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Anno</label>
              <input
                required
                type="number"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.year}
                onChange={e => setForm({...form, year: e.target.value})}
                placeholder="2022"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Posti</label>
              <input
                required
                type="number"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.seats}
                onChange={e => setForm({...form, seats: e.target.value})}
                placeholder="5"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Cambio</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.transmission}
                onChange={e => setForm({...form, transmission: e.target.value})}
              >
                <option value="manual">Manuale</option>
                <option value="automatic">Automatico</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Categoria</label>
              <select
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {VEHICLE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Prezzo giornaliero (ALL)</label>
            <input
              required
              type="number"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              value={form.daily_rate}
              onChange={e => setForm({...form, daily_rate: e.target.value})}
              placeholder="3000"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="w-full text-sm text-gray-500"
            />
            {uploading && <p className="text-xs text-gray-400 mt-1">Caricamento...</p>}
            {photoUrl && (
              <img src={photoUrl} alt="preview" className="mt-2 w-full h-40 object-cover rounded-xl" />
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Ubicazione ritiro</h3>
            <LocationPicker
              initialLat={40.748305}
              initialLng={19.649150}
              onLocationChange={(lat, lng) => {
                setForm({...form, latitude: lat, longitude: lng})
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : 'Salva veicolo'}
          </button>

        </form>
      </div>
    </div>
  )
}