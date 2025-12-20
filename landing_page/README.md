# Authentyc Landing Page

Interactive landing page with ChatGPT link analyzer for waitlist signups.

**Status**: ✅ Structure Complete + Analytics Implemented - Ready for Configuration
**Last Updated**: December 1, 2025

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Run Development Server

```bash
cd /mnt/d/git/authentyc/landing_page
npm install
npm run dev
```

Visit **http://localhost:3000**

The landing page will load with all UI working. Interactive features (ChatGPT analyzer, waitlist) need API keys - see Setup below.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **Email**: Resend
- **Analytics**: PostHog
- **AI**: OpenAI (gpt-4o-mini)
- **Hosting**: Vercel

---

## What's Complete

### ✅ Working Now (No Setup Needed)
- Complete landing page with 9 sections
- Responsive design (mobile/tablet/desktop)
- Professional styling with brand colors
- SEO optimized (metadata, sitemap, robots.txt)
- Form validation (client-side)
- TypeScript compilation (0 errors)
- Analytics tracking code implemented

### ⏳ Needs API Keys to Activate
- ChatGPT link analyzer (needs OpenAI + Supabase)
- Waitlist signup (needs Supabase + Resend)
- Email delivery (needs Resend)
- Analytics tracking (needs PostHog)

---

## Project Structure

```
landing_page/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout + SEO
│   ├── api/
│   │   ├── analyze-chat/     # ChatGPT analyzer API ⭐
│   │   ├── waitlist/         # Waitlist signup API
│   │   └── health/           # Health check
│   ├── privacy/              # Privacy policy
│   └── terms/                # Terms of service
│
├── components/
│   ├── landing/              # 9 landing sections
│   │   ├── Hero.tsx
│   │   ├── ChatAnalyzer.tsx  # Key feature ⭐
│   │   ├── CategoryCards.tsx
│   │   ├── FAQ.tsx
│   │   └── ...
│   ├── forms/                # WaitlistForm, ChatLinkInput
│   └── ui/                   # shadcn/ui components (11)
│
├── lib/
│   ├── supabase/             # Database clients
│   ├── openai/               # AI integration
│   ├── chatgpt/              # HTML parser (FRAGILE!)
│   ├── email/                # Email templates
│   ├── analytics/            # PostHog tracking
│   └── utils/                # Validation, rate limiting
│
└── public/                   # Static assets needed
```

---

## Setup Guide

### 1. Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

**Required Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_your-key
SUPABASE_SECRET_KEY=sb_secret_your-key

# OpenAI
OPENAI_API_KEY=sk-your-key

# Resend (Email)
RESEND_API_KEY=re_your-key

# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_your-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Create Accounts

| Service | Purpose | URL |
|---------|---------|-----|
| **Supabase** | Database | https://supabase.com |
| **OpenAI** | AI Analysis | https://platform.openai.com |
| **Resend** | Email Delivery | https://resend.com |
| **PostHog** | Analytics | https://posthog.com |
| **Vercel** | Hosting (optional) | https://vercel.com |

### 3. Database Setup

1. Create Supabase project
2. Go to SQL Editor
3. Run the migration from `/home/p/.claude/plans/crystalline-riding-eich.md` (Phase 2)
4. Verify tables created: `waitlist_leads`, `chat_analyses`, `rate_limits`, `email_jobs`

### 4. Email Domain Setup

1. Add your domain to Resend (e.g., authentyc.ai)
2. Configure DNS records (SPF, DKIM, DMARC)
3. Verify domain in Resend dashboard
4. Test email delivery

---

## Key Features

### 🎯 ChatGPT Link Analyzer (Core Differentiator)
Users paste ChatGPT shared links → Server fetches HTML → OpenAI analyzes personality → Returns 3 insights + vibe

**Files**: `lib/chatgpt/parser.ts`, `app/api/analyze-chat/route.ts`

### 📝 Waitlist System
Email capture with category selection (Hiring/Dating/Teams) → Auto welcome email → Position tracking

**Files**: `components/forms/WaitlistForm.tsx`, `app/api/waitlist/route.ts`

### 📊 Analytics (PostHog)
**Already Implemented - Just Add API Key!**

What's tracked:
- Scroll depth (25%, 50%, 75%, 100%)
- Category card clicks (which use case interests users)
- CTA button clicks (hero vs final CTA performance)
- Form funnel (opened → abandoned → submitted)

**Implementation**:
- `lib/analytics/posthog.ts` - Core tracking
- `lib/analytics/useScrollTracking.ts` - Scroll tracking
- All landing components have tracking built-in

---

## Analytics Setup

### Quick Start

1. **Get PostHog Key**
   ```bash
   # Go to https://posthog.com
   # Create project: "Authentyc Landing"
   # Copy API key
   ```

2. **Add to Environment**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
   ```

3. **Done!** All events automatically start tracking.

### Events Being Tracked

| Event | What It Tracks | Properties |
|-------|----------------|------------|
| `scroll_depth` | How far users scroll | depth (25/50/75/100) |
| `category_card_clicked` | Which category interests users | category (hiring/dating/teams) |
| `cta_clicked` | CTA button performance | location (hero/final_cta) |
| `waitlist_form_opened` | Form opens | preselected_category |
| `waitlist_form_abandoned` | Form closed without submit | preselected_category |
| `waitlist_form_submitted` | Successful signups | category, interest, position |
| `waitlist_form_error` | Form errors | error_message |

### PostHog Dashboards to Create

#### 1. Conversion Funnel
```
Steps: CTA clicked → Form opened → Form submitted
Purpose: See where users drop off
```

#### 2. Category Popularity
```
Event: category_card_clicked
Break down by: category
Purpose: Which use case resonates most
```

#### 3. Scroll Engagement
```
Event: scroll_depth
Break down by: depth
Purpose: How engaged are users with content
```

#### 4. CTA Performance
```
Event: cta_clicked
Break down by: location
Purpose: Hero vs Final CTA effectiveness
```

### Testing Analytics

After adding PostHog key:
1. Open browser console (debug mode is on in development)
2. Scroll page → see `scroll_depth` events
3. Click category cards → see `category_card_clicked`
4. Click CTAs → see `cta_clicked`
5. Open/close/submit form → see form events
6. Check PostHog dashboard → Live Events to verify

**Files**: See `lib/analytics/` for implementation details.

---

## Critical Implementation Notes

### ⚠️ ChatGPT Parser Fragility

**Location**: `lib/chatgpt/parser.ts`

This is the **most fragile component**:
- ChatGPT's HTML structure changes frequently without notice
- **Expect monthly updates required**
- Has multiple fallback parsing strategies built-in
- Monitor success rate in PostHog

If parsing drops below 50% success rate, update parser immediately.

### 🔒 Security

- ✅ `.env.local` is gitignored
- ✅ Service role keys never exposed to client
- ✅ API keys only in server components/routes
- ✅ Rate limiting: 3 analyses/hour, 10/day per IP
- ✅ Input validation with Zod schemas
- ✅ Share URLs hashed before storage

### 💰 Cost Management

**Expected Monthly Costs:**
- OpenAI: ~$0.01 per analysis with gpt-4o-mini
- Supabase: Free tier sufficient for MVP
- Resend: Free tier (3,000 emails/month)
- PostHog: Free tier (1M events/month)
- Vercel: Free tier sufficient

**Total**: $10-30/month for 500-1,000 analyses

**Recommendations:**
- Set OpenAI budget limit: $50/month
- Monitor usage in OpenAI dashboard
- Set up billing alerts for all services

---

## Testing Checklist

### Before Launch
- [ ] ChatGPT analyzer tested with 10+ real share links
- [ ] Waitlist form submission works
- [ ] Welcome emails deliver correctly
- [ ] Analytics events appear in PostHog
- [ ] Mobile responsive on real devices
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Lighthouse score >90
- [ ] All CTAs work
- [ ] Privacy policy and terms finalized
- [ ] Assets created (favicon, og-image, logo)

### Manual Test Flow
1. Visit landing page
2. Scroll through all sections (triggers scroll tracking)
3. Click category card (triggers category tracking)
4. Click "Get Early Access" (triggers CTA tracking)
5. Fill out waitlist form (triggers form events)
6. Check email for welcome message
7. Verify data in Supabase `waitlist_leads` table
8. Check PostHog dashboard for all events

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add custom domain (authentyc.ai)
```

### Environment Variables in Production

1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Mark sensitive keys as "Secret"
4. Update `NEXT_PUBLIC_SITE_URL` to production URL

### Post-Deployment

- [ ] Test production URL
- [ ] Verify all APIs work in production
- [ ] Test email delivery from production
- [ ] Monitor Vercel Analytics
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Monitor costs (Supabase, OpenAI, Resend)

---

## Development Notes

### Brand Colors

```css
Primary Blue:     #2D3FE5
Primary Hover:    #1E2DB8
Accent Red/Pink:  #FF6B6B
Accent Hover:     #E84545
```

Usage in Tailwind:
```tsx
className="bg-brand-primary hover:bg-brand-primary-hover"
className="text-brand-accent"
```

### Rate Limiting

Configured in `lib/utils/ratelimit.ts`:
- 3 analyses per IP per hour
- 10 analyses per IP per day
- Prevents abuse of free analyzer

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/analyze-chat` | POST | Analyze ChatGPT link |
| `/api/waitlist` | POST | Waitlist signup |
| `/api/health` | GET | Health check |

---

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Tailwind classes not working
```bash
# Restart dev server
npm run dev
```

### TypeScript errors
```bash
npm run build
```

### Environment variables not loading
- Ensure file is named `.env.local` (not `.env`)
- Restart dev server after changes
- Check for typos in variable names

### ChatGPT parser failing
- ChatGPT HTML likely changed (happens frequently)
- Update parser selectors in `lib/chatgpt/parser.ts`
- Check PostHog for parsing success rate

---

## Assets Needed

Create and place in `/public/`:

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Browser favicon |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `og-image.png` | 1200x630 | Social media preview |
| `logo.svg` | Scalable | Site logo |

Use brand colors (#2D3FE5, #FF6B6B) for all assets.

---

## Next Steps

See **TODO.md** for complete task checklist.

**Critical Path:**
1. ⚠️ Wire up waitlist form to CTA buttons (UI integration needed)
2. Configure environment variables
3. Set up accounts (Supabase, OpenAI, Resend, PostHog)
4. Run database migration
5. Test with real data
6. Create assets
7. Deploy to Vercel

---

## File Reference

**Analytics Implementation:**
- `lib/analytics/posthog.ts:13-30` - Core tracking functions
- `lib/analytics/useScrollTracking.ts` - Scroll tracking hook
- `components/analytics/PageAnalytics.tsx` - Page wrapper
- `components/landing/Hero.tsx:13-18` - Hero CTA tracking
- `components/landing/FinalCTA.tsx:13-18` - Final CTA tracking
- `components/landing/CategoryCards.tsx:57-61` - Category tracking
- `components/forms/WaitlistForm.tsx:58-104` - Form funnel tracking

**Critical Components:**
- `lib/chatgpt/parser.ts` - HTML parser (update frequently!)
- `app/api/analyze-chat/route.ts` - Analyzer API
- `app/api/waitlist/route.ts` - Waitlist API
- `components/forms/WaitlistForm.tsx` - Signup form

---

## Support

- **Implementation Plan**: `/home/p/.claude/plans/crystalline-riding-eich.md`
- **Task Checklist**: `TODO.md`
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **PostHog Docs**: https://posthog.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## License

Proprietary - © 2025 Authentyc AI, Inc.
