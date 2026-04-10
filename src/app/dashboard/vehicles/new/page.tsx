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
    category: '', // Vuoto all'inizio per forzare la scelta
    description: '',
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

    // Validimi me Zod
    try {
      vehicleSchema.parse({
        brand: form.brand,
        model: form.model,
        plate: form.plate.toUpperCase(),
        year: parseInt(form.year),
        price_per_day: parseFloat(form.daily_rate),
        latitude: form.latitude,
        longitude: form.longitude,
        description: form.description,
      })
    } catch (err: any) {
      setError(err.message || 'Gabim validimi')
      setLoading(false)
      return
    }

    // Default per campi nascosti se la categoria non li prevede (Gruppo 3)
    const isHeavy = form.category === 'gruppo-speciali'
    const finalSeats = isHeavy ? 1 : (parseInt(form.seats) || 1)
    const finalTransmission = isHeavy ? 'manual' : form.transmission

    const { error } = await supabase.from('vehicles').insert({
      brand: form.brand,
      model: form.model,
      plate: form.plate.toUpperCase(),
      year: parseInt(form.year),
      seats: finalSeats,
      transmission: finalTransmission,
      daily_rate: parseFloat(form.daily_rate),
      category: form.category,
      description: form.description,
      latitude: form.latitude,
      longitude: form.longitude,
      photos: photoUrl ? [photoUrl] : [],
      status: 'available',
    })
    
    setLoading(false)
    
    if (error) {
      setError('Gabim: ' + error.message)
    } else {
      router.push('/dashboard/vehicles')
    }
  }

  const isHeavy = form.category === 'gruppo-speciali'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Mjet i ri</h1>
          <p className="text-zinc-500 text-lg font-light">Zgjidh kategorinë për të vazhduar me detajet</p>
        </div>

        {/* Step 1: Category Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {VEHICLE_CATEGORIES.map((cat) => {
            const isActive = form.category === cat.id
            return (
              <div
                key={cat.id}
                onClick={() => setForm({ ...form, category: cat.id })}
                className={`cursor-pointer border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 text-black'
                }`}
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <div>
                  <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-black'}`}>
                    {cat.name.replace(/[^a-zA-Z\s,]/g, '')}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>

        {/* Step 2: Conditional Form */}
        {form.category && (
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-2xl font-semibold text-black">Te Dhenat Kryesore</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Marka</label>
                <input
                  required
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.brand}
                  onChange={e => setForm({...form, brand: e.target.value})}
                  placeholder="psh. Toyota"
                />
              </div>
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Modeli</label>
                <input
                  required
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.model}
                  onChange={e => setForm({...form, model: e.target.value})}
                  placeholder="psh. Corolla"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Targa</label>
                <input
                  required
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all uppercase"
                  value={form.plate}
                  onChange={e => setForm({...form, plate: e.target.value})}
                  placeholder="AA 123 BB"
                />
              </div>
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Viti</label>
                <input
                  required
                  type="number"
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.year}
                  onChange={e => setForm({...form, year: e.target.value})}
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Çmimi ditor / ALL</label>
                <input
                  required
                  type="number"
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg font-bold text-blue-900 focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.daily_rate}
                  onChange={e => setForm({...form, daily_rate: e.target.value})}
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Conditional Fields (Hidden for Special Vehicles) */}
            {!isHeavy && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-100 pt-8 mt-4">
                <div>
                  <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Vende</label>
                  <input
                    required={!isHeavy}
                    type="number"
                    className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                    value={form.seats}
                    onChange={e => setForm({...form, seats: e.target.value})}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Marsha</label>
                  <select
                    className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all cursor-pointer"
                    value={form.transmission}
                    onChange={e => setForm({...form, transmission: e.target.value})}
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatik</option>
                  </select>
                </div>
              </div>
            )}

            {/* Description / Notes */}
            <div className="border-t border-zinc-100 pt-8 mt-4">
              <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Shënime & Informacione Extra</label>
              <textarea
                className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                rows={3}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Shkruaj detaje si: kapaciteti i bagazhit, pajisje speciale, gërvishtje, rregulla specifike..."
              />
            </div>

            {/* Location & Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-100 pt-8 mt-4">
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Pika e Marrjes (Harta)</label>
                <div className="h-64 rounded-2xl overflow-hidden border border-zinc-200">
                  <LocationPicker 
                    initialLat={form.latitude}
                    initialLng={form.longitude}
                    onLocationChange={(lat, lng) => setForm({...form, latitude: lat, longitude: lng})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Foto e Mjetit</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-zinc-50 text-center h-64">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm text-zinc-500 mb-4 font-light">Ngarko një foto ballore të mjetit</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        disabled={uploading}
                        className="text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:opacity-90 transition-all"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="mt-8 w-full bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full py-5 text-lg font-medium transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]"
            >
              {loading ? 'Duke e ruajtur...' : 'Shto Mjetin në Flotë'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}