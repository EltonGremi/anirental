# 🚗 AutoRent Albania

A modern car rental platform built with Next.js, Supabase, and Cloudflare.

## Stack

- **Frontend:** Next.js 16.2, React 19, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Cloudflare Pages (free)
- **Backend:** Cloudflare Workers (free)
- **Auth:** Google OAuth via Supabase

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/anirental.git
cd anirental
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Get your Supabase keys from:
- https://app.supabase.com → Select project → Settings → API

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm run start
```

## Deployment

### Frontend (Cloudflare Pages)

```bash
npx wrangler login
npx wrangler pages deploy .next
```

Or connect your GitHub repo via [Cloudflare Dashboard](https://dash.cloudflare.com/pages)

### Backend (Cloudflare Workers)

See `cloudflare-workers/` directory for notification and webhook handlers.

## Project Structure

```
src/
├── app/
│   ├── cars/[id]/           # Car details, booking, reviews
│   ├── dashboard/           # Admin & client dashboards
│   ├── category/[slug]/     # Category filtering
│   └── page.tsx             # Homepage
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── format.ts            # Utility functions
│   └── categories.ts        # Vehicle categories
└── middleware.ts            # Auth protection

supabase/
├── functions/
│   ├── notify-booking/      # Telegram notifications
│   └── telegram-webhook/    # Callback handler
└── config.toml              # Local config

cloudflare-workers/          # Coming soon
├── notify-booking/
└── telegram-webhook/
```

## Security Notes

⚠️ **Never commit sensitive data:**
- `.env.local` is in `.gitignore`
- Use environment variables for all secrets
- Telegram token, API keys, etc. go in `.env.local` (local) or Cloudflare/Supabase dashboards (production)

## Features

- 🔐 Google OAuth authentication
- 🚗 Car catalog with advanced filters
- 📅 Booking system with date availability
- ⭐ Reviews and ratings
- 🤖 Telegram notifications for new bookings
- 📧 Email confirmations via Resend
- 🗺️ Interactive maps for pickup locations
- 🎬 Photo gallery and videos per vehicle
- 👨‍💼 Admin dashboard (vehicle & booking management)
- 👥 Client dashboard (my bookings)

## Environment Variables

| Variable | Required | Where | Purpose |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client | Public Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server | Admin Supabase key |
| `TELEGRAM_BOT_TOKEN` | ✅ | Workers | Telegram bot token |
| `TELEGRAM_CHAT_ID` | ✅ | Workers | Admin chat ID |
| `RESEND_API_KEY` | ✅ | Workers | Email API key |

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Cloudflare Workers](https://workers.cloudflare.com)

## License

MIT
