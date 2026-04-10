export const VEHICLE_CATEGORIES = [
  {
    id: 'gruppo-auto',
    name: 'Auto, Moto & SUV',
    description: 'Makina familjare, fuoristradë, sedan, moto dhe skuter.',
    slug: 'auto',
    color: 'bg-zinc-50',
    textColor: 'text-black',
    icon: '🚗',
  },
  {
    id: 'gruppo-trasporto',
    name: 'Transport Pasagjerësh & Mallrash',
    description: 'Furgonë mallrash, minivan për pasagjerë dhe transport komercial.',
    slug: 'trasporto',
    color: 'bg-zinc-50',
    textColor: 'text-black',
    icon: '🚐',
  },
  {
    id: 'gruppo-speciali',
    name: 'Kamionë, Kamper & Makineri',
    description: 'Pajisje të rënda, kamper dhe kamionë industrialë.',
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
