# Analytics Implementation Guide

## Overview

The landing page has comprehensive analytics tracking implemented using PostHog. All tracking code is in place and ready to use - you just need to add your PostHog API key to activate it.

## Quick Setup

1. **Get PostHog Key**
   - Go to https://posthog.com and create a free account
   - Create a new project called "Authentyc Landing"
   - Copy your project API key from Project Settings

2. **Configure Environment**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
   ```

3. **Start Tracking**
   - That's it! All events will automatically start flowing to PostHog

## What's Being Tracked

### 1. Scroll Depth Tracking
**Event:** `scroll_depth`

Tracks how far users scroll down the page.

**Properties:**
- `depth` - Milestone reached (25, 50, 75, or 100)
- `page` - Page path

**Implementation:** `lib/analytics/useScrollTracking.ts`

**Use Case:** Understand engagement - do users read the whole page or bounce early?

---

### 2. Category Card Clicks
**Event:** `category_card_clicked`

Tracks which use case category users are most interested in.

**Properties:**
- `category` - Which card was clicked ('hiring', 'dating', or 'teams')
- `location` - Always 'category_cards_section'

**Implementation:** `components/landing/CategoryCards.tsx:57-61`

**Use Case:** Answer "Which category got the most clicks?" - tells you product-market fit.

---

### 3. CTA Button Clicks
**Event:** `cta_clicked`

Tracks clicks on "Get Early Access" buttons.

**Properties:**
- `location` - Where the button is ('hero' or 'final_cta')
- `button_text` - Always 'Get Early Access'

**Implementation:**
- Hero: `components/landing/Hero.tsx:13-18`
- Final CTA: `components/landing/FinalCTA.tsx:13-18`

**Use Case:** Measure conversion intent - how many users click to sign up?

---

### 4. Form Funnel Tracking

#### Form Opened
**Event:** `waitlist_form_opened`

Fires when the waitlist dialog opens.

**Properties:**
- `preselected_category` - Category if opened from category card, or 'none'

#### Form Abandoned
**Event:** `waitlist_form_abandoned`

Fires when user closes the form without submitting.

**Properties:**
- `preselected_category` - Category if opened from category card, or 'none'

#### Form Submitted
**Event:** `waitlist_form_submitted`

Fires when form is successfully submitted.

**Properties:**
- `preselected_category` - How they entered the form
- `primary_interest` - What they selected (hiring_recruiter, dating, etc.)
- `has_ai_history` - Their AI experience level
- `waitlist_position` - Their position in the waitlist

#### Form Error
**Event:** `waitlist_form_error`

Fires when form submission fails.

**Properties:**
- `error_message` - The error that occurred
- `preselected_category` - How they entered the form

**Implementation:** `components/forms/WaitlistForm.tsx:58-104`

**Use Case:**
- Answer "Did anyone click Get Early Access but not complete the form?"
- Calculate form abandonment rate
- Optimize conversion funnel

---

### 5. Bounce Rate (Automatic)
**Event:** Automatic PostHog tracking

PostHog automatically tracks page views and session duration to calculate bounce rate.

**No code needed** - works out of the box once PostHog is configured.

---

## PostHog Dashboard Setup

### Recommended Insights to Create

#### 1. Conversion Funnel
```
CTA Click → Form Opened → Form Submitted
```

**Steps:**
1. Go to PostHog → Insights → New Insight
2. Select "Funnel"
3. Add steps:
   - `cta_clicked`
   - `waitlist_form_opened`
   - `waitlist_form_submitted`
4. Save as "Waitlist Conversion Funnel"

**Shows:** Where users drop off in the signup process

---

#### 2. Category Popularity
```
Count of category_card_clicked, broken down by category
```

**Steps:**
1. New Insight → Trends
2. Event: `category_card_clicked`
3. Break down by: `category`
4. Chart type: Bar chart
5. Save as "Category Popularity"

**Shows:** Which use case resonates most with users

---

#### 3. Scroll Engagement
```
Count of scroll_depth events by depth
```

**Steps:**
1. New Insight → Trends
2. Event: `scroll_depth`
3. Break down by: `depth`
4. Save as "Scroll Depth Distribution"

**Shows:** How engaged users are with content

---

#### 4. Form Abandonment Rate
```
(form_opened - form_submitted) / form_opened * 100
```

**Steps:**
1. New Insight → Funnel
2. Steps: `waitlist_form_opened` → `waitlist_form_submitted`
3. View drop-off percentage
4. Save as "Form Abandonment"

**Shows:** What % of users abandon the form

---

#### 5. CTA Performance
```
Count of cta_clicked by location
```

**Steps:**
1. New Insight → Trends
2. Event: `cta_clicked`
3. Break down by: `location`
4. Save as "CTA Performance"

**Shows:** Which CTA position performs better

---

## Testing Your Analytics

### Before Going Live

1. **Add PostHog Key** to `.env.local`

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

3. **Test Each Event**
   - [ ] Scroll to 25%, 50%, 75%, 100% - check console for events
   - [ ] Click each category card - should see `category_card_clicked`
   - [ ] Click Hero CTA - should see `cta_clicked` with `location: 'hero'`
   - [ ] Click Final CTA - should see `cta_clicked` with `location: 'final_cta'`
   - [ ] Open form - should see `waitlist_form_opened`
   - [ ] Close form - should see `waitlist_form_abandoned`
   - [ ] Submit form - should see `waitlist_form_submitted`

4. **Check PostHog Dashboard**
   - Go to PostHog → Live Events
   - Verify all events appear with correct properties
   - If events don't appear, check browser console for errors

### Debug Mode

PostHog debug mode is enabled in development:

```typescript
// lib/analytics/posthog.ts:22-24
if (process.env.NODE_ENV === 'development') {
  posthog.debug();
}
```

Check browser console to see all tracked events.

---

## Answering Your Key Questions

### "Which category got the most clicks?"
**Dashboard:** Category Popularity chart
**Event:** `category_card_clicked`
**Properties:** Group by `category`

### "How far did people scroll?"
**Dashboard:** Scroll Depth Distribution
**Event:** `scroll_depth`
**Properties:** Filter by `depth`

### "Did anyone click Get Early Access but not complete the form?"
**Dashboard:** Waitlist Conversion Funnel
**Events:** `cta_clicked` → `waitlist_form_opened` → `waitlist_form_submitted`
**Metric:** Drop-off between steps

### "What was the bounce rate?"
**Dashboard:** PostHog Session Analytics (automatic)
**Location:** PostHog → Session Recordings → Bounce Rate

---

## Files Reference

| File | Purpose |
|------|---------|
| `lib/analytics/posthog.ts` | Core PostHog setup and `trackEvent()` function |
| `lib/analytics/useScrollTracking.ts` | Scroll depth tracking hook |
| `components/analytics/PageAnalytics.tsx` | Page-level tracking wrapper |
| `components/landing/Hero.tsx` | Hero CTA tracking |
| `components/landing/FinalCTA.tsx` | Final CTA tracking |
| `components/landing/CategoryCards.tsx` | Category click tracking |
| `components/forms/WaitlistForm.tsx` | Form funnel tracking |
| `app/page.tsx` | Includes PageAnalytics component |
| `app/providers.tsx` | Initializes PostHog on app load |

---

## Advanced: Custom Tracking

To add custom tracking elsewhere in the app:

```tsx
'use client';

import { trackEvent } from '@/lib/analytics/posthog';

function MyComponent() {
  const handleClick = () => {
    trackEvent('custom_event_name', {
      property1: 'value1',
      property2: 123,
    });
  };

  return <button onClick={handleClick}>Track Me</button>;
}
```

---

## Privacy & Compliance

PostHog is GDPR compliant and privacy-friendly:
- No cookies required (uses localStorage)
- Can be self-hosted if needed
- Supports opt-out mechanisms
- EU data residency available

**Recommendation:** Add privacy notice to your Privacy Policy mentioning PostHog usage.

---

## Cost

PostHog Free Tier:
- 1M events/month
- Unlimited team members
- All features included

Your landing page will likely use ~10-50k events/month, so free tier is plenty.

---

## Support

- PostHog Docs: https://posthog.com/docs
- PostHog Community: https://posthog.com/questions
- This Implementation: Check code comments in files listed above
