'use client'

import { useEffect, useRef, useState } from 'react'

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
  onLocationChange: (lat: number, lng: number) => void
}

export default function LocationPicker({
  initialLat = 40.748305,
  initialLng = 19.649150,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [lat, setLat] = useState(initialLat)
  const [lng, setLng] = useState(initialLng)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    // Ngarko Leaflet
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.async = true
    script.onload = () => {
      if (mapContainer.current && (window as any).L) {
        const L = (window as any).L

        // Inicializo hartën
        const map = L.map(mapContainer.current).setView([lat, lng], 13)
        mapRef.current = map

        // Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map)

        // Marker fillestar
        const marker = L.marker([lat, lng], { draggable: true })
          .bindPopup('Tërhiq shënuesin për të ndryshuar pozicionin')
          .addTo(map)
        markerRef.current = marker

        // Përditëso koordinatat kur lëvizet shënuesi
        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          setLat(pos.lat)
          setLng(pos.lng)
          onLocationChange(pos.lat, pos.lng)
        })

        // Kliko në hartë për të pozicionuar shënuesin
        map.on('click', (e: any) => {
          const { lat: newLat, lng: newLng } = e.latlng
          setLat(newLat)
          setLng(newLng)
          marker.setLatLng([newLat, newLng])
          onLocationChange(newLat, newLng)
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (mapContainer.current && mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  // Qendro hartën kur ndryshojnë koordinatat
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      mapRef.current.setView([lat, lng], 13)
    }
  }, [lat, lng])

  return (
    <div className="space-y-4">
      <div>
        <div
          ref={mapContainer}
          className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden"
        />
        <p className="text-xs text-gray-500 mt-2">💡 Kliko në hartë për të pozicionuar shënuesin ose tërhiqe atë</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Gjerësia gjeografike</label>
          <input
            type="number"
            value={lat.toFixed(6)}
            onChange={(e) => {
              const newLat = parseFloat(e.target.value)
              setLat(newLat)
              onLocationChange(newLat, lng)
            }}
            step="0.000001"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Gjatësia gjeografike</label>
          <input
            type="number"
            value={lng.toFixed(6)}
            onChange={(e) => {
              const newLng = parseFloat(e.target.value)
              setLng(newLng)
              onLocationChange(lat, newLng)
            }}
            step="0.000001"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
