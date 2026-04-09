import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Kërkesa u dërgua!</h1>
        <p className="text-gray-500 mb-2">
          Kërkesa jote u pranua dhe është në pritje të konfirmimit.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Do të kontaktoheni përmes Telegram ose telefonit për të konfirmuar detajet dhe paradhënien.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/"
            className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-700">
            Kthehu te katalogu
          </Link>
          <Link href="/dashboard"
            className="w-full border border-gray-200 text-gray-600 rounded-lg px-4 py-3 text-sm hover:bg-gray-50">
            Rezervimet e mia
          </Link>
        </div>
      </div>
    </div>
  )
}