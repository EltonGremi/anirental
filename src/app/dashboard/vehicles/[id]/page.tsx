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
    category: 'gruppo-auto',
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
          category: data.category || 'gruppo-auto',
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

    const { error } = await supabase
      .from('vehicles')
      .update({
        brand: form.brand,
        model: form.model,
        plate: form.plate,
        year: parseInt(form.year),
        seats: parseInt(form.seats),
        transmission: form.transmission,
        category: form.category,
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-sm mb-4"
          >
            ← Kthehu mbrapa
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Modifiko mjetin</h1>
          <p className="text-gray-500 text-sm mt-1">
            {vehicle?.brand} {vehicle?.model} · {vehicle?.plate}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          {/* Informacione të përgjithshme */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Informacione të përgjithshme</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Marka</label>
                <input
                  required
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({...form, brand: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Modeli</label>
                <input
                  required
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({...form, model: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Targa</label>
                <input
                  required
                  type="text"
                  value={form.plate}
                  onChange={(e) => setForm({...form, plate: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Viti</label>
                <input
                  required
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({...form, year: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Detaje */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🔧 Detaje</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Vende</label>
                <input
                  required
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({...form, seats: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Marsha</label>
                <select
                  value={form.transmission}
                  onChange={(e) => setForm({...form, transmission: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatik</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Çmimi ditor (ALL)</label>
                <input
                  required
                  type="number"
                  step="100"
                  value={form.daily_rate}
                  onChange={(e) => setForm({...form, daily_rate: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Kategoria</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {VEHICLE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              </div>
            </div>
          </div>

          {/* Vendndodhja e marrjes */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Vendndodhja e marrjes</h2>
            <LocationPicker
              initialLat={form.latitude}
              initialLng={form.longitude}
              onLocationChange={(lat, lng) => {
                setForm({...form, latitude: lat, longitude: lng})
              }}
            />
          </div>

          {/* Butonat */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? 'Duke ruajtur...' : '💾 Ruaj ndryshimet'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-gray-200 text-gray-700 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-50"
            >
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
