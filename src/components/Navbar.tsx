import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  // Verifichiamo la sessione corrente per gestire l'UI (Accedi/Esci)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-100/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-black tracking-tight hover:opacity-70 transition-opacity">
          AUTORENT
          <span className="text-zinc-400 font-normal ml-2 text-sm tracking-normal">ALBANIA</span>
        </Link>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/#kategori" className="text-sm text-zinc-500 hover:text-black transition-colors hidden md:block font-medium">
            Flota
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-white bg-black hover:bg-zinc-800 shadow-sm hover:shadow-md rounded-full px-6 py-2.5 transition-all duration-300 font-medium truncate hidden sm:block">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login"
              className="text-sm text-white bg-black hover:bg-zinc-800 shadow-sm hover:shadow-md rounded-full px-6 py-2.5 transition-all duration-300 font-medium">
              Hyr
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
