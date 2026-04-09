# 🚗 AutoRent Albania

Platformë moderne për marrje me qira makinash, ndërtuar me Next.js, Supabase dhe Vercel.

## Stack Teknik

- **Frontend:** Next.js 16.2, React 19, TypeScript, Tailwind CSS
- **Databazë:** Supabase (PostgreSQL)
- **Deploy:** Vercel (Frontend & Webhooks)
- **Backend:** Next.js Serverless Functions / Route Handlers në Vercel
- **Autentifikim:** Google OAuth përmes Supabase

## Si të Fillosh

### 1. Klono repository-n

```bash
git clone https://github.com/EltonGremi/anirental.git
cd anirental
```

### 2. Instalo varësitë

```bash
npm install
```

### 3. Konfiguro variablat e mjedisit

Kopjo `.env.example` në `.env.local` dhe plotëso kredencialet:

```bash
cp .env.example .env.local
```

Merr çelësat e Supabase nga:
- https://app.supabase.com → Zgjidh projektin → Settings → API

### 4. Nis serverin e zhvillimit

```bash
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000)

### 5. Ndërto për prodhim

```bash
npm run build
npm run start
```

## Deploy

### Frontend & Backend (Vercel)

Projekti është optimizuar për deploy zero-config në [Vercel](https://vercel.com).
Webhook-et dhe API-të (si njoftimet Telegram) ekzekutohen si Serverless Functions përmes Next.js Route Handlers (`src/app/api/...`).

Mund të lidhësh repository-n GitHub me panelin e Vercel ose të bësh deploy nga CLI:

```bash
npm i -g vercel
vercel
```

## Strukturë e Projektit

```
src/
├── app/
│   ├── cars/[id]/           # Detaje makine, rezervim, vlerësime
│   ├── dashboard/           # Paneli i adminit & klientit
│   ├── category/[slug]/     # Filtrim sipas kategorisë
│   └── page.tsx             # Faqja kryesore
├── components/
│   └── Navbar.tsx           # Navbar globale
├── lib/
│   ├── supabase/            # Klientë Supabase
│   ├── format.ts            # Funksione ndihmëse
│   ├── categories.ts        # Kategoritë e mjeteve
│   └── validators.ts        # Validatorë Zod
└── middleware.ts             # Mbrojtje autentifikimi

supabase/
├── functions/
│   ├── notify-booking/      # Njoftimet Telegram
│   └── telegram-webhook/    # Callback handler
└── config.toml              # Konfigurim lokal
```

## Shënime Sigurie

⚠️ **Mos publiko kurrë të dhëna sensitive:**
- `.env.local` është në `.gitignore`
- Përdor variabla mjedisi për të gjitha sekretet
- Token Telegram, çelësa API, etj. vendosen në `.env.local` (lokal) ose në panelin Vercel/Supabase (prodhim)

## Funksionalitete

- 🔐 Autentifikim me Google OAuth
- 🚗 Katalog mjetesh me filtra të avancuara
- 📅 Sistem rezervimi me disponueshmëri datash
- ⭐ Vlerësime dhe nota
- 🤖 Njoftime Telegram për rezervime të reja
- 📧 Konfirmime me email përmes Resend
- 🗺️ Harta interaktive për vendndodhjen e marrjes
- 🎬 Galeri fotosh dhe videosh për çdo mjet
- 👨‍💼 Panel admini (menaxhim mjetesh & rezervimesh)
- 👥 Panel klienti (rezervimet e mia)

## Variablat e Mjedisit

| Variabël | E nevojshme | Ku | Qëllimi |
|----------|-------------|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Klient | URL e projektit Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Klient | Çelësi publik Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server | Çelësi admin Supabase |
| `TELEGRAM_BOT_TOKEN` | ✅ | Server | Token i bot-it Telegram |
| `TELEGRAM_CHAT_ID` | ✅ | Server | ID e chat-it admin |
| `RESEND_API_KEY` | ✅ | Server | Çelësi API i Resend |

## Mëso Më Shumë

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## Liçencë

MIT
