export const VEHICLE_CATEGORIES = [
  {
    id: 'gruppo-auto',
    name: 'Auto, Moto & SUV',
    description: 'Auto familiari, fuoristrada, berline, moto e scooter.',
    slug: 'auto',
    color: 'bg-zinc-50',
    textColor: 'text-black',
    icon: '🚗',
  },
  {
    id: 'gruppo-trasporto',
    name: 'Trasporto Passeggeri & Merci',
    description: 'Furgoni merci, minivan per passeggeri e trasporto commerciale.',
    slug: 'trasporto',
    color: 'bg-zinc-50',
    textColor: 'text-black',
    icon: '🚐',
  },
  {
    id: 'gruppo-speciali',
    name: 'Camion, Camper & Macchinari',
    description: 'Equipaggiamenti pesanti, camper, e camion industriali.',
    slug: 'speciali',
    color: 'bg-zinc-50',
    textColor: 'text-black',
    icon: '🏗️',
  },
]

export const getCategoryById = (id: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.id === id)

export const getCategoryBySlug = (slug: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.slug === slug)
