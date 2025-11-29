# Authentyc Landing Page

Interactive landing page with ChatGPT link analyzer for waitlist signups.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **Email**: Resend
- **Analytics**: PostHog
- **AI**: OpenAI (gpt-4o-mini)
- **Hosting**: Vercel

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── analyze-chat/         # ChatGPT link analysis
│   │   ├── waitlist/             # Waitlist signup
│   │   └── health/               # Health check
│   ├── privacy/                  # Privacy policy page
│   └── terms/                    # Terms of service page
├── components/
│   ├── landing/                  # Landing page sections
│   ├── forms/                    # Form components
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── openai/                   # OpenAI integration
│   ├── chatgpt/                  # ChatGPT parsing (FRAGILE!)
│   ├── email/                    # Email templates
│   ├── analytics/                # PostHog setup
│   └── utils/                    # Utilities & validation
└── public/                       # Static assets
```

## Getting Started

### 1. Prerequisites

Create accounts for:
- [Supabase](https://supabase.com) - Database
- [OpenAI](https://platform.openai.com) - AI analysis
- [Resend](https://resend.com) - Email delivery
- [PostHog](https://posthog.com) - Analytics
- [Vercel](https://vercel.com) - Hosting (optional for local dev)

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and fill in your API keys
```

### 3. Database Setup

1. Go to Supabase SQL Editor
2. See `/home/p/.claude/plans/crystalline-riding-eich.md` for complete schema
3. Run the SQL migration

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

### 🎯 ChatGPT Link Analyzer (Core Differentiator)
- Users paste ChatGPT shared links
- Server fetches and parses conversation HTML
- OpenAI analyzes personality traits
- Returns 3 key insights + overall vibe
- Drives waitlist conversions

### 📝 Waitlist System
- Email capture with validation
- Category selection (Hiring/Dating/Teams)
- Automatic welcome email
- Position tracking

### 📊 Analytics
- PostHog event tracking
- UTM campaign tracking
- Conversion funnel monitoring

## Development Notes

### ⚠️  ChatGPT Parser Fragility
The ChatGPT HTML parser (`lib/chatgpt/parser.ts`) is the most fragile component. ChatGPT's HTML structure changes frequently without notice.

**Expect to update monthly!**

Monitor the parsing success rate in PostHog. If it drops below 50%, update the parser immediately.

### Cost Management
- OpenAI: ~$0.01 per analysis with gpt-4o-mini
- Set budget limits in OpenAI dashboard
- Expected: $10-30/month for 500-1000 analyses

### Rate Limiting
- 3 analyses per IP per hour
- 10 analyses per IP per day
- Prevents abuse of free analysis feature

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Custom Domain
1. Purchase domain (authentyc.ai recommended)
2. Add domain in Vercel dashboard
3. Configure DNS records
4. Wait for SSL certificate (automatic)

## Testing

### Manual Testing Checklist
- [ ] ChatGPT analyzer with 10+ real share links
- [ ] Waitlist form submission
- [ ] Email delivery
- [ ] All CTAs work
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Safari, Firefox)

### Browser Testing
- Chrome (latest)
- Safari (iOS + macOS)
- Firefox
- Edge

## Monitoring

- PostHog dashboard: Track conversions, events
- Vercel Analytics: Monitor performance
- Supabase Dashboard: Database metrics
- OpenAI Dashboard: API usage & costs

## Support

For issues or questions, see the implementation plan at:
`/home/p/.claude/plans/crystalline-riding-eich.md`

## License

Proprietary - © 2025 Authentyc AI, Inc.
