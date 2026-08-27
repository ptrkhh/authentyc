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

### Database Setup
Run `migration.sql` in the Supabase SQL Editor. It creates `waitlist_leads`,
`chat_analyses`, `rate_limits`, `email_jobs` and `prompts` — check all five
exist afterwards. `cleanup.sql` drops them again to start fresh (destructive).

Email delivery is covered end-to-end by the analyze-chat canary, which pages
through Resend on failure — see `.github/workflows/canary-analyze-chat.yml`.

---
