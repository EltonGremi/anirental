import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-gray-900 hover:opacity-80 transition-opacity">
          AutoRent Albania
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/#kategori" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block font-medium">
            Flota
          </Link>
          <Link href="/login"
            className="text-sm text-white bg-gray-900 hover:bg-gray-800 shadow-sm hover:shadow-md rounded-lg px-5 py-2.5 transition-all duration-200 font-medium">
            Hyr
          </Link>
        </div>
      </div>
    </nav>
  )
}
