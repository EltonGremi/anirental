'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Forza il ricaricamento lato server per spengere la sessione nella Navbar
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 shadow-sm hover:shadow-md rounded-full px-6 py-2.5 transition-all duration-300 font-medium"
      title="Dil (Esci)"
    >
      Dil
    </button>
  )
}
