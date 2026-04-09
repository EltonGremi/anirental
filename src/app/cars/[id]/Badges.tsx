export default function Badges({ badges }: { badges?: string[] }) {
  if (!badges?.length) return null

  const badgeStyles: Record<string, { bg: string; text: string; icon: string }> = {
    i_ri: { bg: 'bg-green-100', text: 'text-green-700', icon: '✨' },
    ofertë: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🔥' },
    popullor: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '⭐' },
    eko: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🌱' },
    luksoz: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
    // Fallback for Italian badge names (backwards compat with DB data)
    nuovo: { bg: 'bg-green-100', text: 'text-green-700', icon: '✨' },
    offerta: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🔥' },
    popolare: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '⭐' },
    eco: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🌱' },
    lusso: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map((badge) => {
        const style = badgeStyles[badge.toLowerCase()] || badgeStyles['i_ri']
        return (
          <span
            key={badge}
            className={`inline-block ${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium`}
          >
            <span className="mr-1">{style.icon}</span>
            {badge.charAt(0).toUpperCase() + badge.slice(1)}
          </span>
        )
      })}
    </div>
  )
}
