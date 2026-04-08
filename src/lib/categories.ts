export const VEHICLE_CATEGORIES = [
  {
    id: 'famiglia',
    name: '🚗 Auto Familiari',
    description: 'Perfette per viaggi in famiglia',
    slug: 'famiglia',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🚗',
  },
  {
    id: 'suv',
    name: '🚙 SUV & Fuoristrada',
    description: 'Potenza e comfort fuoristrada',
    slug: 'suv',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '🚙',
  },
  {
    id: 'furgone-piccolo',
    name: '🚐 Furgoni Piccoli',
    description: 'Perfetti per piccoli trasporti',
    slug: 'furgone-piccolo',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: '🚐',
  },
  {
    id: 'furgone-grande',
    name: '🚚 Furgoni Grandi',
    description: 'Per trasporti importanti',
    slug: 'furgone-grande',
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: '🚚',
  },
  {
    id: 'camion',
    name: '🚛 Camioni',
    description: 'Capacità massima di carico',
    slug: 'camion',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '🚛',
  },
  {
    id: 'moto',
    name: '🏎️ Moto & Scooter',
    description: 'Agilità e libertà',
    slug: 'moto',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: '🏎️',
  },
  {
    id: 'camper',
    name: '🏘️ Camper',
    description: 'Viaggia con tutti i comfort',
    slug: 'camper',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: '🏘️',
  },
  {
    id: 'attrezzature',
    name: '🏗️ Attrezzature',
    description: 'Escavatori, piattaforme e altro',
    slug: 'attrezzature',
    color: 'bg-gray-50',
    textColor: 'text-gray-700',
    icon: '🏗️',
  },
]

export const getCategoryById = (id: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.id === id)

export const getCategoryBySlug = (slug: string) =>
  VEHICLE_CATEGORIES.find((cat) => cat.slug === slug)
