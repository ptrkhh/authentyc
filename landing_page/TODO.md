# Authentyc Landing Page - TODO

**Last Updated**: April 4, 2026
**Status**: Legal Pages Complete → Ready for Production Testing

---

## 🔴 Phase 0: UI Integration (DO FIRST)
**Priority**: CRITICAL | **Time**: 1-2 hours

- [x] Create waitlist form state in `app/page.tsx`
- [x] Wire up Hero CTA button to open form
- [x] Wire up Final CTA button to open form
- [x] Wire up Category Cards to open form with preselected category
- [x] Add WaitlistForm component to page
- [x] Test all CTAs open the form correctly

---

## Phase 1: Account Setup
**Time**: 2-4 hours

- [x] Supabase account created
- [x] OpenAI account created + API key
- [x] Resend account created
- [x] PostHog account created
- [x] Copy `.env.example` to `.env.local`
- [x] Fill in all environment variables
- [x] Verify dev server starts without errors

---

## Phase 2: Database Setup
**Time**: 30 minutes

- [x] Create Supabase project
- [x] Run database migration in SQL Editor
- [x] Verify `waitlist_leads` table created
- [x] Verify `chat_analyses` table created
- [x] Verify `rate_limits` table created
- [x] Verify `email_jobs` table created
- [x] Test database connection from app

---

## Phase 3: Domain & Email
**Time**: 1-2 hours

- [x] Register free authentyc.dpdns.org domain
- [x] Add domain to Resend
- [x] Configure DNS records (SPF, DKIM, DMARC)
- [x] Verify domain in Resend
- [x] Send test email ✅ (Working with onboarding@resend.dev - custom domain pending verification)

---

## Phase 4: Asset Creation
**Time**: 2-4 hours

- [x] Create `favicon.ico` (32x32)
- [x] Create `apple-touch-icon.png` (180x180)
- [x] Create `og-image.png` (1200x630)
- [x] Create `logo.svg`
- [x] Upload all assets to Supabase e.g. https://epdjtermjtfijzmhxzoo.supabase.co/storage/v1/object/public/Public/something.svg
- [x] Verify favicon appears in browser

---

## Phase 5: Testing
**Time**: 4-8 hours

### Local Development
- [x] Run `npm run dev` successfully
- [x] All sections render correctly
- [x] Responsive on mobile
- [x] Responsive on tablet
- [x] Responsive on desktop

### ChatGPT Analyzer
- [x] Create 10+ test ChatGPT conversations
- [x] Test analyzer with each link
- [x] Verify insights are generated
- [x] Check insights stored in database
- [x] Monitor for parsing errors

### Waitlist Form
- [x] Submit form with test email
- [x] Verify data in `waitlist_leads` table
- [x] Verify welcome email received
- [x] Test email in Gmail
- [x] Test email in Outlook
- [x] Test email on mobile

### Analytics
- [x] Add PostHog key to `.env.local`
- [ ] Verify scroll depth events fire
- [ ] Verify category card clicks tracked
- [ ] Verify Hero CTA clicks tracked
- [ ] Verify Final CTA clicks tracked
- [ ] Verify form opened event
- [ ] Verify form abandoned event
- [ ] Verify form submitted event
- [ ] Check PostHog dashboard shows events

### Error Handling
- [x] Test with invalid ChatGPT links
- [x] Test duplicate email signup
- [ ] Test rate limiting
- [x] Verify error messages are user-friendly

---

## Phase 6: Legal Pages ✅
**Time**: 2-4 hours | **Status**: COMPLETE

- [x] Review Privacy Policy placeholder
- [x] Customize Privacy Policy for actual practices
- [x] Add data retention details (30 days for analyses, indefinite for waitlist)
- [x] Add third-party services list (Supabase, OpenAI, Gemini, Resend, PostHog, Vercel)
- [x] Review Terms of Service placeholder
- [x] Customize Terms of Service with AI disclaimers
- [x] Add service availability terms (beta/no SLA)
- [x] Add binding arbitration clause & liability protections

### What Was Delivered:
- **Privacy Policy**: 12 comprehensive sections with GDPR/CCPA compliance
- **Terms of Service**: 19 sections with strong AI disclaimers ("entertainment/experimental purposes only")
- **Legal Protections**: Binding arbitration, $100 liability cap, warranty disclaimers
- **Data Policies**: Clear retention (30-day auto-delete for analyses), user ownership of data
- **Third-Party Disclosure**: Complete list with privacy policy links

See: `app/privacy/page.tsx` and `app/terms/page.tsx`

---

## Phase 7: Deployment
**Time**: 1-2 hours

### Vercel Setup
- [x] Create Vercel account
- [x] Install Vercel CLI
- [x] Connect GitHub repository
- [x] Deploy to Vercel

### Environment Variables
- [x] Add all env vars to Vercel dashboard
- [x] Mark `SUPABASE_SECRET_KEY` as sensitive
- [x] Mark `OPENAI_API_KEY` as sensitive
- [x] Update `NEXT_PUBLIC_SITE_URL` to production

### Free Domain (authentyc.dpdns.org)
- [x] Add custom domain in Vercel
- [x] Configure DNS records
- [x] Wait for DNS propagation
- [x] Verify HTTPS enabled

### Paid Domain (authentyc.ai)
- [x] Add custom domain in Vercel
- [x] Configure DNS records
- [x] Wait for DNS propagation
- [x] Verify HTTPS enabled

### Production Testing
- [x] Test production URL loads
- [x] Test ChatGPT analyzer on production
- [x] Test waitlist signup on production
- [x] Verify email delivery from production
- [x] Check analytics in production
- [x] Monitor Vercel Analytics

---

## 🚨 CRITICAL BEFORE LAUNCH (Legal Compliance)

### Legal Email Addresses (REQUIRED) ✅
- [x] Set up `hello@authentyc.ai` email address (via Lark Suite - free)
- [x] Set up `privacy@authentyc.ai` email address (via Lark Suite - free)
  - Must be monitored DAILY for data deletion requests (GDPR/CCPA compliance)
  - 30-day response time is legally required
- [x] Set up `legal@authentyc.ai` email address (via Lark Suite - free)
  - For terms violations, DMCA claims, dispute resolution
  - Check at least 2-3 times per week

---

## Pre-Launch Checklist

### Social Accounts

- [x] Create Twitter/X account (@AuthentycAI) → https://x.com/AuthentycAI
- [x] Create LinkedIn page → https://www.linkedin.com/company/authentyc
- [x] Update social links in Footer.tsx (via constants)
- [ ] Update social links in email templates

### ACTUALLY COSTS MONEY
- [x] Purchase/verify authentyc.ai domain

### Code Quality
- [x] `npm run build` succeeds with no errors
- [x] No TypeScript errors
- [x] Remove/disable console.log statements
- [x] Review all TODO comments in code

### Security
- [x] `.env.local` is in `.gitignore`
- [x] No API keys in source code
- [x] Rate limiting tested and working
- [x] Input validation reviewed
- [x] Check for XSS vulnerabilities
- [ ] Review CORS settings

### SEO & Marketing
- [ ] All meta tags correct
- [ ] Test Open Graph preview
- [ ] Test Twitter Card preview
- [ ] Submit sitemap to Google Search Console

---

## Launch Readiness

**Ready to launch when ALL checked:**

### Core Functionality
- [ ] All Phase 0-7 tasks completed
- [ ] No errors in production
- [ ] All environment variables configured
- [ ] Database working
- [ ] ChatGPT analyzer tested with 10+ links
- [ ] Waitlist form + emails working
- [ ] All assets created
- [ ] Production tested
- [ ] Lighthouse score >90
- [ ] Mobile tested on real devices
- [ ] Cross-browser tested
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Billing alerts configured

## Legal Stuff

### Legal Review (HIGHLY RECOMMENDED)
- [ ] Schedule attorney review of Privacy Policy
  - Focus: GDPR/CCPA compliance, data retention policies
  - Budget: $1,500-$3,000 for tech lawyer
- [ ] Schedule attorney review of Terms of Service
  - Focus: AI liability, arbitration clause, employment law implications (hiring use case)
  - Ensure compliance with Delaware law and federal arbitration act
- [ ] Review state-specific requirements (if targeting specific states)
  - California: CCPA compliance verified
  - EU/UK: GDPR compliance for international users
  - Employment law: EEOC compliance for hiring use case

### Optional Legal Enhancements
- [ ] Add cookie consent banner (if targeting EU users)
  - Required for PostHog analytics cookies under GDPR
  - Library: `react-cookie-consent` or similar
- [ ] Track terms acceptance version
  - Add `terms_version` and `terms_accepted_at` to `waitlist_leads` table
  - Log which version of Terms/Privacy Policy each user accepted
- [ ] Obtain Data Processing Agreements (DPAs) from vendors
  - Request DPAs from Supabase, OpenAI, Resend if needed for enterprise customers

### Legal Compliance (CRITICAL)
- [x] Legal pages finalized (Privacy Policy + Terms of Service)
- [x] Legal email addresses set up (`hello@`, `privacy@`, `legal@authentyc.ai`) via Lark Suite
- [ ] Legal review completed OR risk accepted for beta launch
- [ ] Terms acceptance tracking implemented (optional but recommended)
- [ ] Cookie consent banner added (if targeting EU users)
