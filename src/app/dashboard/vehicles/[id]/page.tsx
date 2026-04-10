'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import LocationPicker from '../LocationPicker'
import { VEHICLE_CATEGORIES } from '@/lib/categories'

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vehicle, setVehicle] = useState<any>(null)
  const [form, setForm] = useState({
    brand: '',
    model: '',
    plate: '',
    year: '',
    seats: '',
    transmission: 'manual',
    daily_rate: '',
    category: '',
    description: '',
    latitude: 40.748305,
    longitude: 19.649150,
  })

  // Ngarko të dhënat e mjetit
  useEffect(() => {
    const fetchVehicle = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single()

      if (!error && data) {
        setVehicle(data)
        setForm({
          brand: data.brand,
          model: data.model,
          plate: data.plate,
          year: data.year?.toString() || '',
          seats: data.seats?.toString() || '',
          transmission: data.transmission,
          daily_rate: data.daily_rate?.toString() || '',
          category: data.category || '',
          description: data.description || '',
          latitude: data.latitude || 40.748305,
          longitude: data.longitude || 19.649150,
        })
      }
      setLoading(false)
    }

    fetchVehicle()
  }, [vehicleId, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const isHeavy = form.category === 'gruppo-speciali'
    const finalSeats = isHeavy ? 1 : (parseInt(form.seats) || 1)
    const finalTransmission = isHeavy ? 'manual' : form.transmission

    const { error } = await supabase
      .from('vehicles')
      .update({
        brand: form.brand,
        model: form.model,
        plate: form.plate,
        year: parseInt(form.year),
        seats: finalSeats,
        transmission: finalTransmission,
        category: form.category,
        description: form.description,
        daily_rate: parseFloat(form.daily_rate),
        latitude: form.latitude,
        longitude: form.longitude,
      })
      .eq('id', vehicleId)

    setSaving(false)

    if (!error) {
      alert('✅ Mjeti u përditësua!')
      router.push('/dashboard/vehicles')
    } else {
      alert('❌ Gabim: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-gray-500">Duke ngarkuar...</p>
      </div>
    )
  }

  const isHeavy = form.category === 'gruppo-speciali'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-black hover:border-black transition-all"
            title="Kthehu mbrapa"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight mb-1">Modifiko Mjetin</h1>
            <p className="text-zinc-500 text-lg font-light">
              {vehicle?.brand} {vehicle?.model} · <span className="font-medium text-black uppercase">{vehicle?.plate}</span>
            </p>
          </div>
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
              <h2 className="text-2xl font-semibold text-black">Të Dhënat Kryesore</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Marka</label>
                <input
                  required
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.brand}
                  onChange={e => setForm({...form, brand: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Modeli</label>
                <input
                  required
                  className="w-full bg-zinc-50 border-0 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  value={form.model}
                  onChange={e => setForm({...form, model: e.target.value})}
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
                />
              </div>
            </div>

            {/* Conditional Fields */}
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
                placeholder="Detaje rreth mjetit..."
              />
            </div>

            {/* Location */}
            <div className="border-t border-zinc-100 pt-8 mt-4">
              <label className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Pika e Marrjes (Harta)</label>
              <div className="h-72 rounded-2xl overflow-hidden border border-zinc-200">
                <LocationPicker 
                  initialLat={form.latitude}
                  initialLng={form.longitude}
                  onLocationChange={(lat, lng) => setForm({...form, latitude: lat, longitude: lng})}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-8 mt-4 border-t border-zinc-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed rounded-full py-5 text-lg font-medium transition-all shadow-md"
              >
                {saving ? 'Duke e ruajtur...' : '💾 Ruaj Ndryshimet'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-none border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 rounded-full px-8 py-5 text-lg font-medium transition-all"
              >
                Anulo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
