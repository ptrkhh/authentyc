# Authentyc Landing Page - Quick Start Guide

Get your landing page running in minutes! 🚀

## Prerequisites Checklist

Before you begin, make sure you have:
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed

## Step 1: Clone & Install (Already Done!)

You've already created the project. Just verify dependencies:

```bash
cd /mnt/d/git/authentyc/landing_page
npm install
```

## Step 2: Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env.local

# Edit .env.local
nano .env.local  # or use your favorite editor
```

### Minimum Required for Development

For initial development/testing, you can start with placeholder values:

```bash
# Supabase (required for waitlist & analyzer)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder

# OpenAI (required for ChatGPT analyzer)
OPENAI_API_KEY=sk-placeholder

# Optional for development
RESEND_API_KEY=placeholder
NEXT_PUBLIC_POSTHOG_KEY=placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️  Important**: The ChatGPT analyzer and waitlist won't work with placeholder values. See "Production Setup" below for real credentials.

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 4: Test the Landing Page

You should see:
- ✅ Hero section with "Stop guessing. Start knowing."
- ✅ Problem section (3 cards)
- ✅ Solution section
- ✅ How It Works
- ✅ ChatGPT Analyzer (won't work without real API keys)
- ✅ Category cards
- ✅ FAQ
- ✅ Final CTA
- ✅ Footer

## What Works Right Now

✅ **UI/Layout**: All sections render properly
✅ **Styling**: Tailwind CSS with brand colors
✅ **Responsive**: Mobile/tablet/desktop layouts
✅ **SEO**: Metadata, sitemap, robots.txt

❌ **Not Working Yet** (needs real API keys):
- ChatGPT link analyzer
- Waitlist signup
- Email delivery
- Analytics tracking

## Production Setup

To make everything work, you need to create accounts and get real API keys:

### 1. Supabase (Database)

```bash
# 1. Go to https://supabase.com/dashboard
# 2. Create new project: "authentyc-landing"
# 3. Get credentials from Settings → API
# 4. Run database migration (see below)
```

**Database Migration**:
1. Go to Supabase SQL Editor
2. Copy the complete schema from `/home/p/.claude/plans/crystalline-riding-eich.md` (Phase 2: Database Setup)
3. Paste and run the SQL

### 2. OpenAI (AI Analysis)

```bash
# 1. Go to https://platform.openai.com/api-keys
# 2. Create new secret key
# 3. Set billing limits: $50/month recommended
# 4. Copy key to OPENAI_API_KEY
```

### 3. Resend (Email)

```bash
# 1. Go to https://resend.com
# 2. Add your domain (authentyc.ai)
# 3. Configure DNS records
# 4. Create API key
```

### 4. PostHog (Analytics)

```bash
# 1. Go to https://posthog.com
# 2. Create project: "Authentyc Landing"
# 3. Copy project API key
```

## Testing with Real APIs

Once you have real credentials:

### Test ChatGPT Analyzer
1. Create a ChatGPT conversation
2. Share it (click Share button in ChatGPT)
3. Copy the share link
4. Paste into analyzer on your landing page
5. Should see personality insights!

### Test Waitlist
1. Fill out waitlist form
2. Check Supabase → waitlist_leads table
3. Check email inbox for welcome message

## Common Issues

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
# Check all files compile
npm run build
```

### Environment variables not loading
- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after changes
- Check for typos in variable names

## Next Steps

1. **Get real API credentials** - Create accounts for Supabase, OpenAI, Resend, PostHog
2. **Create assets** - See `public/README.md` for required images
3. **Test thoroughly** - Test analyzer with 10+ ChatGPT links
4. **Deploy** - Push to Vercel when ready

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure custom domain
```

## Need Help?

- **Implementation Plan**: `/home/p/.claude/plans/crystalline-riding-eich.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **README**: `README.md`

## Development Tips

### Hot Reload
Changes to components auto-reload. No need to restart server.

### Check Build
```bash
npm run build
```
Make sure there are no errors before deploying.

### TypeScript Strict Mode
Fix all TypeScript errors before deploying:
```bash
npm run type-check  # if you add this script
```

---

**You're ready to build! 🎉**

Start with Phase 0 (Account Setup) from the implementation plan, then move through the phases systematically.
