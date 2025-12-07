# Development Notes

Always let the user run `npm run dev` themselves, don't run it for them.

## Environment Variables

Located in `.env.local` (never commit this file!)

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase key
- `SUPABASE_SERVICE_ROLE_KEY` - Private Supabase key (server-only)
- `GEMINI_API_KEY` - Gemini API for chat analysis
- `RESEND_API_KEY` - Resend for email delivery
- `RESEND_FROM_DOMAIN` - Verified email domain (authentyc.dpdns.org)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key

---

## Testing

### Email Testing
```bash
node test-email.js ptrkhh@outlook.com
```

### Database Testing
Run `verify_tables.sql` in Supabase SQL Editor

---
