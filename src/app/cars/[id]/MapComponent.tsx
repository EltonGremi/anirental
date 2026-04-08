'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
  latitude: number
  longitude: number
  title: string
}

export default function MapComponent({ latitude, longitude, title }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carica il CSS di Leaflet
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)

    // Carica il JS di Leaflet
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.async = true
    script.onload = () => {
      if (mapContainer.current && (window as any).L) {
        const L = (window as any).L
        const map = L.map(mapContainer.current).setView([latitude, longitude], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map)

        L.marker([latitude, longitude])
          .bindPopup(`<strong>${title}</strong>`)
          .addTo(map)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = ''
      }
    }
  }, [latitude, longitude, title])

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Ubicazione ritiro</h3>
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-2xl border border-gray-100 overflow-hidden"
      />
    </div>
  )
}
