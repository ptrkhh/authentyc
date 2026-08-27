# Development Notes

Always let the user run `npm run dev` themselves, don't run it for them.

## Environment Variables

Located in `.env.local` (never commit this file!)

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Public Supabase publishable key
- `SUPABASE_SECRET_KEY` - Private Supabase secret key (server-only)
- `GEMINI_API_KEY` - Gemini API for chat analysis
- `RESEND_API_KEY` - Resend for email delivery
- `RESEND_FROM_DOMAIN` - Verified email domain (authentyc.dpdns.org)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key

---

## Testing

```bash
npm test        # unit + accessibility suites
npm run test:ci # what CI runs
```

### Database Testing
Run `verify_tables.sql` in Supabase SQL Editor

Email delivery is covered end-to-end by the analyze-chat canary, which pages
through Resend on failure — see `.github/workflows/canary-analyze-chat.yml`.

---
