export const VEHICLE_CATEGORIES = [
  {
    id: 'familje',
    name: '🚗 Makina Familjare',
    description: 'Perfekte për udhëtime familjare',
    slug: 'familje',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🚗',
  },
  {
    id: 'suv',
    name: '🚙 SUV & Fuoristradë',
    description: 'Fuqi dhe komoditet jashtë rrugës',
    slug: 'suv',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '🚙',
  },
  {
    id: 'furgon-i-vogel',
    name: '🚐 Furgonë të Vegjël',
    description: 'Perfekt për transportime të vogla',
    slug: 'furgon-i-vogel',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: '🚐',
  },
  {
    id: 'furgon-i-madh',
    name: '🚚 Furgonë të Mëdhenj',
    description: 'Për transportime të mëdha',
    slug: 'furgon-i-madh',
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: '🚚',
  },
  {
    id: 'kamion',
    name: '🚛 Kamionë',
    description: 'Kapacitet maksimal ngarkimi',
    slug: 'kamion',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '🚛',
  },
  {
    id: 'moto',
    name: '🏎️ Moto & Skuter',
    description: 'Shkathtësi dhe liri',
    slug: 'moto',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: '🏎️',
  },
  {
    id: 'kamper',
    name: '🏘️ Kamper',
    description: 'Udhëto me gjithë komoditetet',
    slug: 'kamper',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: '🏘️',
  },
  {
    id: 'pajisje',
    name: '🏗️ Pajisje',
    description: 'Ekskavatorë, platforma dhe të tjera',
    slug: 'pajisje',
    color: 'bg-gray-50',
    textColor: 'text-gray-700',
    icon: '🏗️',
  },
]

export const getCategoryById = (id: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.id === id)

export const getCategoryBySlug = (slug: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.slug === slug)
