'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">
      <div className="absolute top-8 left-8">
        <a href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black transition-colors">
          ← Kthehu në shtëpi
        </a>
      </div>
      
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-10 flex flex-col gap-8 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2">AutoRent Albania</h1>
          <p className="text-zinc-500 font-light text-lg">Hyr për të menaxhuar rezervimet</p>
        </div>
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-zinc-800 rounded-full py-5 text-lg font-medium transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]"
        >
          <div className="bg-white p-1 rounded-full">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
            </svg>
          </div>
          Hyr me Google
        </button>
      </div>
    </div>
  )
}