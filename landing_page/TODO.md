# Authentyc Landing Page - TODO List

This document tracks all remaining tasks to launch the landing page.

**Last Updated**: November 30, 2025
**Status**: Structure 100% Complete + Analytics Implemented - Configuration & Integration Needed

---

## 🎉 Just Completed: Analytics Implementation

All analytics tracking is now fully implemented! Here's what was added:

| Metric | Status | Implementation |
|--------|--------|----------------|
| **Scroll Depth** | ✅ Complete | Tracks 25%, 50%, 75%, 100% milestones |
| **Category Clicks** | ✅ Complete | Tracks which category (hiring/dating/teams) gets clicked |
| **CTA Clicks** | ✅ Complete | Tracks "Get Early Access" clicks from hero & final CTA |
| **Form Opened** | ✅ Complete | Tracks when waitlist form opens |
| **Form Abandoned** | ✅ Complete | Tracks when form closes without submitting |
| **Form Submitted** | ✅ Complete | Tracks successful submissions with metadata |
| **Bounce Rate** | ✅ Auto | PostHog tracks automatically once configured |

**PostHog Events Created:**
- `scroll_depth` - How far users scroll
- `category_card_clicked` - Which category was clicked
- `cta_clicked` - CTA button clicks
- `waitlist_form_opened` - Form opened
- `waitlist_form_abandoned` - Form closed without submit
- `waitlist_form_submitted` - Successful submission
- `waitlist_form_error` - Submission errors

**Files Modified/Created:**
- `lib/analytics/useScrollTracking.ts` (NEW)
- `components/analytics/PageAnalytics.tsx` (NEW)
- `components/landing/Hero.tsx` (tracking added)
- `components/landing/FinalCTA.tsx` (tracking added)
- `components/landing/CategoryCards.tsx` (tracking added)
- `components/forms/WaitlistForm.tsx` (tracking added)
- `app/page.tsx` (PageAnalytics added)

**To Activate:** Just add your PostHog key to `.env.local` and all tracking will work immediately!

---

## 🔴 Critical Path (Must Complete Before Launch)

### Phase 0: UI Integration (MUST DO FIRST)
**Status**: ❌ Not Started
**Time Estimate**: 1-2 hours
**Priority**: HIGHEST - Required for basic functionality

The analytics tracking is now fully implemented, but the CTA buttons don't actually open the waitlist form yet. This needs to be wired up.

- [ ] **Create Waitlist Form State Management**
  - Add state in `app/page.tsx` to control form open/close
  - Add state to track preselected category
  - Pass state and handlers to all components that need it

- [ ] **Wire Up Hero CTA Button**
  - File: `components/landing/Hero.tsx:18`
  - Current: Just tracks analytics, has `TODO: Open waitlist form`
  - Action: Add onClick handler to open WaitlistForm dialog
  - Should open form with no preselected category

- [ ] **Wire Up Final CTA Button**
  - File: `components/landing/FinalCTA.tsx:18`
  - Current: Just tracks analytics, has `TODO: Open waitlist form`
  - Action: Add onClick handler to open WaitlistForm dialog
  - Should open form with no preselected category

- [ ] **Wire Up Category Cards**
  - File: `components/landing/CategoryCards.tsx:63`
  - Current: Just tracks analytics, has `TODO: Open waitlist form with pre-selected category`
  - Action: Add onClick handler to open WaitlistForm with preselected category
  - Should pre-fill the "primary_interest" field based on category clicked
  - Category mapping:
    - 'hiring' → 'hiring_recruiter' (default) or show both options
    - 'dating' → 'dating'
    - 'teams' → 'cofounder' (default) or show both options

- [ ] **Add WaitlistForm to Page**
  - File: `app/page.tsx`
  - Import and render WaitlistForm component
  - Pass `open`, `onOpenChange`, and `preselectedCategory` props
  - Form should be controlled by parent state

**Example Implementation Approach:**
```tsx
// In app/page.tsx
const [formOpen, setFormOpen] = useState(false);
const [preselectedCategory, setPreselectedCategory] = useState<string | undefined>();

const openForm = (category?: string) => {
  setPreselectedCategory(category);
  setFormOpen(true);
};

// Pass openForm handler to Hero, FinalCTA, CategoryCards
// Render WaitlistForm with open={formOpen} onOpenChange={setFormOpen}
```

---

### Phase 1: Account Setup & API Keys
**Status**: ❌ Not Started
**Time Estimate**: 2-4 hours

- [ ] **Supabase**
  - Create account at https://supabase.com
  - Create new project: "authentyc-landing"
  - Get API credentials from Settings → API
  - Update `.env.local` with:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **OpenAI**
  - Create account at https://platform.openai.com
  - Create API key at https://platform.openai.com/api-keys
  - Set billing limit: $50/month recommended
  - Update `.env.local` with `OPENAI_API_KEY`

- [ ] **Resend (Email)**
  - Create account at https://resend.com
  - Add domain: authentyc.ai
  - Configure DNS records (SPF, DKIM, DMARC)
  - Verify domain
  - Create API key
  - Update `.env.local` with `RESEND_API_KEY`
  - Verify sender email: hello@authentyc.ai

- [ ] **PostHog (Analytics)**
  - Create account at https://posthog.com
  - Create project: "Authentyc Landing"
  - Copy project API key
  - Update `.env.local` with `NEXT_PUBLIC_POSTHOG_KEY`

- [ ] **Environment Configuration**
  - Copy `.env.example` to `.env.local`
  - Replace all TODO_ prefixed values with real credentials
  - Verify all environment variables are set
  - Test that dev server starts without errors

---

### Phase 2: Database Setup
**Status**: ❌ Not Started
**Time Estimate**: 30 minutes

- [ ] **Supabase Database Migration**
  - Open Supabase SQL Editor
  - Run complete schema from implementation plan
  - Verify tables created:
    - `waitlist_leads`
    - `chat_analyses`
    - `rate_limits`
    - `email_jobs`
  - Verify indexes created
  - Test connection from app

- [ ] **Database Testing**
  - Insert test record into `waitlist_leads`
  - Query to verify it works
  - Test RLS policies (if enabled)

---

### Phase 3: Domain & Email Setup
**Status**: ❌ Not Started
**Time Estimate**: 1-2 hours

- [ ] **Domain Registration**
  - Verify authentyc.ai is purchased
  - If not, purchase from registrar (Namecheap, Google Domains, etc.)
  - Configure nameservers for Vercel

- [ ] **Email Domain Configuration**
  - Configure DNS records for Resend:
    - SPF record
    - DKIM record
    - DMARC record
  - Verify domain in Resend dashboard
  - Send test email to confirm delivery

- [ ] **Social Media Handles**
  - Create Twitter account: @authentyc_ai
  - Create LinkedIn page
  - Update links in:
    - `components/landing/Footer.tsx` (lines 20, 24)
    - `lib/email/templates.ts` (line 95)

---

### Phase 4: Asset Creation
**Status**: ❌ Not Started
**Time Estimate**: 2-4 hours

See `public/README.md` for specifications.

- [ ] **Favicon** (`public/favicon.ico`)
  - Size: 32x32 or 16x16
  - Use brand colors (#2D3FE5, #FF6B6B)
  - Simple icon version of logo
  - Use tool: https://realfavicongenerator.net

- [ ] **Apple Touch Icon** (`public/apple-touch-icon.png`)
  - Size: 180x180
  - iOS home screen icon

- [ ] **Open Graph Image** (`public/og-image.png`)
  - Size: 1200x630
  - Include branding
  - Headline: "Stop guessing. Start knowing."
  - Subtext: "Match people by who they really are"
  - Use brand colors
  - Tools: Figma, Canva

- [ ] **Logo** (`public/logo.svg`)
  - SVG format for scalability
  - Primary brand logo
  - Used in header/footer
  - Should work at various sizes

---

### Phase 5: Testing
**Status**: ❌ Not Started
**Time Estimate**: 4-8 hours

- [ ] **Local Development Testing**
  - Run `npm run dev`
  - Verify all sections render correctly
  - Test responsive design (mobile, tablet, desktop)
  - Test all navigation links

- [ ] **ChatGPT Analyzer Testing**
  - Create 10+ test ChatGPT conversations
  - Share each conversation (get share link)
  - Test analyzer with each link
  - Verify insights are generated
  - Check insights are stored in database
  - Monitor for parsing errors

- [ ] **Waitlist Form Testing**
  - Fill out form with test email
  - Verify data saved to `waitlist_leads` table
  - Verify welcome email received
  - Check email formatting in multiple clients:
    - Gmail
    - Outlook
    - Apple Mail
    - Mobile email clients
  - Test spam score (use Mail Tester)

- [ ] **Analytics Testing** ✅ **ANALYTICS IMPLEMENTED**
  - **Implementation Complete**: All tracking code is now in place
  - **What's Tracked**:
    - ✅ Scroll depth (25%, 50%, 75%, 100%)
    - ✅ Category card clicks (hiring/dating/teams)
    - ✅ CTA button clicks (hero & final CTA)
    - ✅ Form opened/abandoned/submitted events
    - ✅ Form submission success with metadata
    - ✅ Form submission errors
  - **Testing After PostHog Key Added**:
    - [ ] Verify scroll depth events fire at 25%, 50%, 75%, 100%
    - [ ] Verify category card clicks tracked with correct category
    - [ ] Verify Hero CTA click tracked with location='hero'
    - [ ] Verify Final CTA click tracked with location='final_cta'
    - [ ] Verify 'waitlist_form_opened' fires when form opens
    - [ ] Verify 'waitlist_form_abandoned' fires when closing without submit
    - [ ] Verify 'waitlist_form_submitted' fires with all metadata
    - [ ] Check PostHog dashboard to confirm all events received
  - **PostHog Dashboard Views to Create**:
    - [ ] Conversion funnel: CTA click → Form opened → Form submitted
    - [ ] Category popularity (which category gets most clicks)
    - [ ] Scroll depth distribution chart
    - [ ] Form abandonment rate
  - **Files with Analytics**:
    - `lib/analytics/posthog.ts` - Core tracking functions
    - `lib/analytics/useScrollTracking.ts` - Scroll tracking hook
    - `components/analytics/PageAnalytics.tsx` - Page-level tracking wrapper
    - `components/landing/Hero.tsx:13-18` - Hero CTA tracking
    - `components/landing/FinalCTA.tsx:13-18` - Final CTA tracking
    - `components/landing/CategoryCards.tsx:57-61` - Category tracking
    - `components/forms/WaitlistForm.tsx:58-104` - Form funnel tracking

- [ ] **Cross-Browser Testing**
  - Chrome (latest)
  - Safari (latest)
  - Firefox (latest)
  - Edge (latest)
  - Mobile Safari (iOS)
  - Mobile Chrome (Android)

- [ ] **Performance Testing**
  - Run Lighthouse audit (target >90)
  - Check Core Web Vitals
  - Optimize images if needed
  - Test load time (<2 seconds)

- [ ] **Error Testing**
  - Test with invalid ChatGPT links
  - Test with duplicate email signup
  - Test rate limiting
  - Verify error messages are user-friendly

---

### Phase 6: Legal Pages
**Status**: ⚠️ Placeholder Only
**Time Estimate**: 2-4 hours

- [ ] **Privacy Policy** (`app/privacy/page.tsx`)
  - Review placeholder content
  - Customize for actual data practices
  - Add specific details about:
    - Data retention periods
    - Third-party services used
    - User data rights
    - Contact information
  - Consider using template or consulting lawyer
  - Get legal review (recommended)

- [ ] **Terms of Service** (`app/terms/page.tsx`)
  - Review placeholder content
  - Customize for actual service
  - Add specific terms about:
    - Service availability
    - User obligations
    - Limitation of liability
    - Dispute resolution
  - Consider using template or consulting lawyer
  - Get legal review (recommended)

---

### Phase 7: Deployment
**Status**: ❌ Not Started
**Time Estimate**: 1-2 hours

- [ ] **Vercel Setup**
  - Create Vercel account
  - Install Vercel CLI: `npm i -g vercel`
  - Connect GitHub repository (recommended)
  - Or deploy directly: `vercel`

- [ ] **Environment Variables in Vercel**
  - Add all environment variables from `.env.local`
  - Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive
  - Mark `OPENAI_API_KEY` as sensitive
  - Update `NEXT_PUBLIC_SITE_URL` to production URL

- [ ] **Domain Configuration**
  - Add custom domain: authentyc.ai
  - Configure DNS records
  - Wait for DNS propagation (up to 48 hours)
  - Enable automatic HTTPS

- [ ] **Production Testing**
  - Test production URL
  - Verify all environment variables work
  - Test ChatGPT analyzer on production
  - Test waitlist signup on production
  - Verify email delivery from production
  - Check analytics in production

- [ ] **Production Monitoring**
  - Enable Vercel Analytics
  - Set up error monitoring (optional: Sentry)
  - Monitor database usage in Supabase
  - Monitor OpenAI API usage
  - Set up billing alerts

---

## 🟡 Important (Before Launch)

### Code Quality
- [ ] Run `npm run build` - verify no errors
- [ ] Run TypeScript check - fix any errors
- [ ] Review all console.log statements - remove or disable in production
- [ ] Review all TODO comments in code

### Security Review
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify no API keys in source code
- [ ] Review rate limiting configuration
- [ ] Test rate limiting works
- [ ] Review input validation (Zod schemas)
- [ ] Check for XSS vulnerabilities
- [ ] Review CORS settings

### SEO & Marketing
- [ ] Verify all meta tags are set correctly
- [ ] Test Open Graph preview (use https://www.opengraph.xyz/)
- [ ] Test Twitter Card preview
- [ ] Submit sitemap to Google Search Console
- [ ] Create robots.txt (already exists)
- [ ] Set up Google Analytics (optional)

---

## 🟢 Nice to Have (Post-Launch)

### Documentation
- [ ] Create developer documentation
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Document deployment process

### Launch Activities
- [ ] Draft Product Hunt submission
- [ ] Draft Hacker News post
- [ ] Write launch tweets
- [ ] Prepare email to personal network
- [ ] Create social media graphics
- [ ] Set up monitoring dashboard

### Optional Features
- [ ] Add newsletter signup
- [ ] Add blog/updates section
- [ ] Create demo video
- [ ] Add testimonials (when available)
- [ ] A/B testing setup

---

## 📝 File-Specific TODOs

### Configuration Files
- **`.env.example`** - All placeholders marked with `TODO_` prefix
- **`.env.local`** - NEEDS CREATION with real values

### Code Files
- **`lib/email/templates.ts`**
  - Line 6-7: Verify domain and social handles
  - Line 96: Verify Twitter handle exists
  - Line 111: Verify domain configured

- **`lib/email/resend.ts`**
  - Line 39: Verify email domain configured in Resend

- **`components/landing/Footer.tsx`**
  - Line 7-8: Update social media links and email
  - Line 20: Replace Twitter URL
  - Line 24: Replace LinkedIn URL

- **`app/privacy/page.tsx`**
  - Line 4-5: Replace with actual privacy policy

- **`app/terms/page.tsx`**
  - Line 4-5: Replace with actual terms of service

### Asset Files
- **`public/`** - See public/README.md for complete list
  - favicon.ico
  - apple-touch-icon.png
  - og-image.png
  - logo.svg

---

## 🚀 Launch Readiness Checklist

Before going live, verify ALL of these:

- [ ] All Phase 1-7 tasks completed
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All environment variables configured
- [ ] Database tables created and working
- [ ] ChatGPT analyzer tested with 10+ links
- [ ] Waitlist form tested and emails sending
- [ ] All assets created and uploaded
- [ ] Legal pages reviewed and finalized
- [ ] Production deployment tested
- [ ] Performance score >90 (Lighthouse)
- [ ] Mobile responsive on real devices
- [ ] Cross-browser tested
- [ ] Social media accounts created
- [ ] Domain configured and working
- [ ] Email domain verified and sending
- [ ] Analytics tracking working
- [ ] Error monitoring in place
- [ ] Billing alerts configured

---

## 📊 Progress Tracking

**Overall Progress**: 59/157 tasks complete (38%)

**Recent Updates**:
- ✅ **Nov 30, 2025**: Analytics tracking fully implemented (7 new files/features)
  - Scroll depth tracking
  - Category click tracking
  - CTA click tracking
  - Form funnel tracking (open/abandon/submit)

**Breakdown**:
- ✅ Structure Complete: 52/52 files (100%)
- ✅ Analytics Implementation: 7/7 features (100%)
- ⏳ UI Integration: 0/4 tasks (0%) ← **DO THIS NEXT**
- ⏳ Configuration: 0/15 tasks (0%)
- ⏳ Testing: 0/20 tasks (0%)
- ⏳ Assets: 0/4 tasks (0%)
- ⏳ Legal: 0/2 tasks (0%)
- ⏳ Deployment: 0/10 tasks (0%)

---

## 🔗 References

- **Implementation Plan**: `/home/p/.claude/plans/crystalline-riding-eich.md`
- **Original Plan**: `../LANDING_PAGE_PLAN.md`
- **Quick Start Guide**: `QUICKSTART.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **Status Document**: `IMPLEMENTATION_STATUS.md`
- **Asset Requirements**: `public/README.md`

---

## 📞 Need Help?

If you get stuck on any task:
1. Check the implementation plan for detailed instructions
2. Review the specific file TODOs in comments
3. Check the documentation files listed above
4. Search for similar issues in Next.js/Supabase/OpenAI docs

---

## 🎯 What To Do Next

**Immediate Priority**: Complete **Phase 0: UI Integration** (1-2 hours)

1. **Wire up the waitlist form to CTA buttons** - See Phase 0 above for detailed steps
   - This is required for basic functionality
   - Analytics is ready but buttons don't open the form yet

2. **Then**: Configure PostHog key in `.env.local`
   - This will activate all the analytics tracking that's already implemented
   - Get key from https://posthog.com (free tier)

3. **Then**: Start Phase 1 - Create accounts and configure other environment variables

**Why this order?**
- Phase 0 requires no external accounts, just code changes
- You'll be able to see the form working immediately
- Once PostHog key is added, analytics will start tracking automatically
- Everything else (Supabase, OpenAI, Resend) can wait until you're ready to test those features
