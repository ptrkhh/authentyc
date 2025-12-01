# Authentyc Landing Page - TODO

**Last Updated**: December 1, 2025
**Status**: Structure Complete → Needs Configuration & Integration

---

## 🔴 Phase 0: UI Integration (DO FIRST)
**Priority**: CRITICAL | **Time**: 1-2 hours

- [ ] Create waitlist form state in `app/page.tsx`
- [ ] Wire up Hero CTA button to open form
- [ ] Wire up Final CTA button to open form
- [ ] Wire up Category Cards to open form with preselected category
- [ ] Add WaitlistForm component to page
- [ ] Test all CTAs open the form correctly

---

## Phase 1: Account Setup
**Time**: 2-4 hours

- [ ] Supabase account created
- [ ] OpenAI account created + API key
- [ ] Resend account created
- [ ] PostHog account created
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all environment variables
- [ ] Verify dev server starts without errors

---

## Phase 2: Database Setup
**Time**: 30 minutes

- [ ] Create Supabase project
- [ ] Run database migration in SQL Editor
- [ ] Verify `waitlist_leads` table created
- [ ] Verify `chat_analyses` table created
- [ ] Verify `rate_limits` table created
- [ ] Verify `email_jobs` table created
- [ ] Test database connection from app

---

## Phase 3: Domain & Email
**Time**: 1-2 hours

- [ ] Purchase/verify authentyc.ai domain
- [ ] Add domain to Resend
- [ ] Configure DNS records (SPF, DKIM, DMARC)
- [ ] Verify domain in Resend
- [ ] Send test email
- [ ] Create Twitter account (@authentyc_ai)
- [ ] Create LinkedIn page
- [ ] Update social links in Footer.tsx
- [ ] Update social links in email templates

---

## Phase 4: Asset Creation
**Time**: 2-4 hours

- [ ] Create `favicon.ico` (32x32)
- [ ] Create `apple-touch-icon.png` (180x180)
- [ ] Create `og-image.png` (1200x630)
- [ ] Create `logo.svg`
- [ ] Upload all assets to `/public/`
- [ ] Verify favicon appears in browser

---

## Phase 5: Testing
**Time**: 4-8 hours

### Local Development
- [ ] Run `npm run dev` successfully
- [ ] All sections render correctly
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### ChatGPT Analyzer
- [ ] Create 10+ test ChatGPT conversations
- [ ] Test analyzer with each link
- [ ] Verify insights are generated
- [ ] Check insights stored in database
- [ ] Monitor for parsing errors

### Waitlist Form
- [ ] Submit form with test email
- [ ] Verify data in `waitlist_leads` table
- [ ] Verify welcome email received
- [ ] Test email in Gmail
- [ ] Test email in Outlook
- [ ] Test email on mobile

### Analytics
- [ ] Add PostHog key to `.env.local`
- [ ] Verify scroll depth events fire
- [ ] Verify category card clicks tracked
- [ ] Verify Hero CTA clicks tracked
- [ ] Verify Final CTA clicks tracked
- [ ] Verify form opened event
- [ ] Verify form abandoned event
- [ ] Verify form submitted event
- [ ] Check PostHog dashboard shows events

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance
- [ ] Run Lighthouse audit
- [ ] Score >90 on performance
- [ ] Test load time <2 seconds
- [ ] Optimize images if needed

### Error Handling
- [ ] Test with invalid ChatGPT links
- [ ] Test duplicate email signup
- [ ] Test rate limiting
- [ ] Verify error messages are user-friendly

---

## Phase 6: Legal Pages
**Time**: 2-4 hours

- [ ] Review Privacy Policy placeholder
- [ ] Customize Privacy Policy for actual practices
- [ ] Add data retention details
- [ ] Add third-party services list
- [ ] Review Terms of Service placeholder
- [ ] Customize Terms of Service
- [ ] Add service availability terms
- [ ] Get legal review (recommended)

---

## Phase 7: Deployment
**Time**: 1-2 hours

### Vercel Setup
- [ ] Create Vercel account
- [ ] Install Vercel CLI
- [ ] Connect GitHub repository
- [ ] Deploy to Vercel

### Environment Variables
- [ ] Add all env vars to Vercel dashboard
- [ ] Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive
- [ ] Mark `OPENAI_API_KEY` as sensitive
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production

### Domain
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify HTTPS enabled

### Production Testing
- [ ] Test production URL loads
- [ ] Test ChatGPT analyzer on production
- [ ] Test waitlist signup on production
- [ ] Verify email delivery from production
- [ ] Check analytics in production
- [ ] Monitor Vercel Analytics

---

## Pre-Launch Checklist

### Code Quality
- [ ] `npm run build` succeeds with no errors
- [ ] No TypeScript errors
- [ ] Remove/disable console.log statements
- [ ] Review all TODO comments in code

### Security
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in source code
- [ ] Rate limiting tested and working
- [ ] Input validation reviewed
- [ ] Check for XSS vulnerabilities
- [ ] Review CORS settings

### SEO & Marketing
- [ ] All meta tags correct
- [ ] Test Open Graph preview
- [ ] Test Twitter Card preview
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)

---

## Launch Readiness

**Ready to launch when ALL checked:**

- [ ] All Phase 0-7 tasks completed
- [ ] No errors in production
- [ ] All environment variables configured
- [ ] Database working
- [ ] ChatGPT analyzer tested with 10+ links
- [ ] Waitlist form + emails working
- [ ] All assets created
- [ ] Legal pages finalized
- [ ] Production tested
- [ ] Lighthouse score >90
- [ ] Mobile tested on real devices
- [ ] Cross-browser tested
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Billing alerts configured

---

## Progress Summary

**Overall**: ~60/170 tasks remaining

- ✅ Structure: Complete (52/52 files)
- ✅ Analytics: Complete (7/7 features)
- ⏳ UI Integration: 0/6 tasks
- ⏳ Configuration: 0/15 tasks
- ⏳ Testing: 0/35 tasks
- ⏳ Assets: 0/6 tasks
- ⏳ Legal: 0/8 tasks
- ⏳ Deployment: 0/15 tasks

**Next Action**: Complete Phase 0 (UI Integration)
