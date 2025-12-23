# Master Legal Plan: Authentyc.AI - Indonesia-Based, Globally-Focused

## Overview: Dual-Entity Structure

**The Setup**: Two legal entities working together
- **US Entity** (Delaware C-Corp): Customer-facing, fundraising, IP ownership
- **Indonesian Entity** (PT): Operations, employment, R&D services

**Why This Structure**:
- US customers/VCs expect Delaware C-Corps
- Indonesian operations get cost advantages
- Clean separation for tax/legal purposes
- Standard structure for global tech companies

## Entity Structure Timeline

### Phase 0: Pre-Launch (Month 0-3)
**Start with**: Indonesian PT only
- **Cost**: $2K-4K setup + $1K-2K/year maintenance
- **Purpose**: Founder employment, initial banking, basic operations
- **Why**: Cheapest way to bootstrap, can operate locally

**Set up**:
1. PT (Perseroan Terbatas) - Indonesian limited liability company
2. Indonesian bank account (Mandiri, BCA, or CIMB Niaga)
3. NPWP (tax ID)
4. Basic accounting setup

**Don't need yet**: US entity (avoid unnecessary costs during bootstrap)

### Phase 1: First Revenue or Fundraising Prep (Month 4-9)
**Add**: US Delaware C-Corp
- **Cost**: $1K-2K setup + $2K-5K/year (registered agent, annual reports)
- **Purpose**: Customer contracts, future fundraising, IP ownership
- **Trigger**: First paying customer OR preparing to raise seed round

**Set up**:
1. Delaware C-Corporation (NOT LLC - VCs require C-Corps)
2. US bank account (Mercury, Brex, or SVB recommended for startups)
3. US EIN (tax ID from IRS)
4. Stripe account (for payment processing)
5. Cap table setup (use Carta or Pulley)

**Why Delaware C-Corp**:
- 90% of US VC-backed startups use Delaware
- Well-established corporate law
- VC/acquisition-friendly structure
- Can issue stock options to employees

### Phase 2: Growth (Month 10+)
**Formalize**: Relationship between entities
- Service agreement (PT provides R&D to US Corp)
- IP assignment (PT assigns all IP to US Corp)
- Transfer pricing documentation
- Cross-border tax compliance

## Detailed Entity Structures

### Indonesian PT (Perseroan Terbatas)

**What it does**:
- Employs all Indonesian team members
- Owns/leases office space in Indonesia
- Provides R&D and engineering services to US Corp
- Handles local compliance (BPJS, tax withholding, labor law)

**Setup Requirements**:
1. **Capital**: Minimum IDR 50M (~$3,300) paid-up capital
2. **Directors**: Minimum 1 director (can be foreigner)
3. **Shareholders**: Minimum 2 shareholders
   - Option A: Founder + trusted person (family/friend) with minority stake
   - Option B: Founder + US Corp as shareholders (after US entity created)
4. **Registration**: ~4-8 weeks through OSS system
5. **Permits**: NIB (business license), required permits for software development

**Annual Compliance**:
- Annual tax returns (SPT Tahunan)
- Financial statements
- BPJS contributions for employees
- Quarterly VAT returns if applicable
- Annual general meeting minutes

**Costs**:
- Setup: $2K-4K (using legal service like Cekindo, Emerhub)
- Annual: $1K-2K (accounting, tax filing, compliance)
- Ongoing: BPJS (~10% of salary), corporate tax (22% on profits)

**Legal Service Providers** (for PT setup):
- Cekindo
- Emerhub
- Paul Hastings Indonesia
- SSEK Law Firm

### US Delaware C-Corporation

**What it does**:
- Holds all intellectual property (code, trademarks, patents)
- Signs all customer contracts
- Processes all payments (Stripe in USD)
- Issues equity to founders, employees, investors
- Primary entity for fundraising and eventual exit

**Setup Requirements**:
1. **Incorporation**: File Certificate of Incorporation in Delaware
2. **Bylaws**: Corporate governance rules
3. **Stock**: Issue founder stock (83(b) election within 30 days!)
4. **Board**: Initial board of directors (can be just founder)
5. **Officers**: President, Secretary, Treasurer (can all be same person initially)
6. **Registered Agent**: Required Delaware service ($100-300/year)
7. **EIN**: Get from IRS (free, online)
8. **Bank Account**: Mercury, Brex, or Silicon Valley Bank

**Formation Documents** (Critical):
1. **Certificate of Incorporation**
   - Authorized shares: 10M-20M common stock
   - Preferred stock authorization for future investors
2. **Bylaws**: Standard Delaware bylaws
3. **Founder Stock Purchase Agreement**
   - 4-year vesting, 1-year cliff (standard for founders)
   - File 83(b) election within 30 days (avoid huge tax later!)
4. **Board Consent**: Initial resolutions
5. **IP Assignment Agreement**: All IP owned by corporation

**Cap Table Setup**:
- Use Carta ($2K-3K/year) or Pulley ($1K-2K/year)
- Set up from day 1 to avoid mess later
- Issue founder stock with vesting schedule
- Create option pool (10-15% for future employees)

**Annual Compliance**:
- Delaware annual franchise tax ($400-500/year minimum)
- Annual report filing
- Board meetings (quarterly recommended, annual required)
- Corporate record keeping
- US tax returns (even if no income, file Form 1120)

**Costs**:
- Setup: $1K-2K (DIY with Stripe Atlas or Clerky)
- Setup: $5K-15K (with lawyer - recommended if raising $1M+)
- Annual: $2K-5K (registered agent, franchise tax, accounting)
- Cap table: $1K-3K/year (Carta/Pulley)

**Service Providers** (for C-Corp setup):
- **DIY**: Stripe Atlas ($500), Clerky ($2K-3K)
- **Law Firms**: Gunderson Dettmer, Goodwin Procter, Cooley (for funded startups)
- **Accounting**: Pilot, Kruze Consulting (startup-focused)

## Cross-Border Structure: How They Work Together

### Service Agreement (Critical Document)

**PT provides services to US Corp**:
- Engineering/development
- R&D activities
- Data processing
- Technical support

**US Corp pays PT**:
- Monthly service fee (cost + reasonable markup, e.g., 10-20%)
- Documented via invoices
- Transfer pricing must be arm's length (market rate)

**Why this matters**:
- Legitimizes money flow between entities
- Tax authorities in both countries will scrutinize this
- Ensures profit allocation is defensible

**Example**:
```
PT monthly costs: $100K (salaries + ops)
PT invoices US Corp: $110K-120K (cost + 10-20% markup)
US Corp revenue: $200K (from customers)
Result:
  - PT profit: $10K-20K (taxed in Indonesia at 22%)
  - US Corp profit: $80K-90K (taxed in US)
```

### IP Ownership (Critical for Exit/Fundraising)

**All IP must be owned by US Corp**:
- Source code
- Trademarks
- Patents
- Trade secrets
- Customer data

**How to ensure this**:
1. **IP Assignment Agreement**: PT assigns all IP to US Corp
   - Sign this immediately when US Corp is formed
   - Covers past and future IP
   - Irrevocable assignment
2. **Work-for-Hire**: Service agreement states all work is "work for hire" for US Corp
3. **Employee IP Assignments**: All PT employees sign IP assignment to PT, which flows to US Corp

**Why this matters**:
- VCs won't invest if IP is owned by Indonesian entity
- Acquirers need clean IP ownership
- US customers want contracts with IP-owning entity

**Template Language** (from service agreement):
> "All intellectual property created by PT in performance of services shall be deemed work-made-for-hire owned exclusively by US Corp. To the extent any IP is not work-made-for-hire, PT hereby irrevocably assigns all right, title, and interest to US Corp."

### Employment Structure

**Indonesian Employees** (Engineering, Ops):
- Employed by PT
- Indonesian employment contracts (comply with Labor Law 13/2003)
- BPJS (health + employment insurance) contributions required
- Severance requirements if terminated (complex - consult lawyer)
- Can receive US Corp stock options (via separate agreement)

**US/Remote Employees** (Sales, eventually):
- Option 1: 1099 contractors (simplest initially)
- Option 2: Use EOR (Employer of Record) like Deel, Remote.com ($500-700/employee/month)
- Option 3: Employ directly via US Corp (requires state registration, payroll setup)
- Can receive US Corp stock options directly

**Equity/Stock Options**:
- Issue from US Corp only (not PT)
- Indonesian employees can receive US Corp options via separate agreement
- US Corp creates stock option plan (10-15% pool initially)
- Standard vesting: 4 years, 1-year cliff
- File 83(b) elections for early exercise (if applicable)

**Important**: Indonesian tax authorities may consider vested stock options as taxable income. Consult tax advisor.

### Banking & Money Flow

**US Corp Bank Account** (Mercury/Brex/SVB):
- Receives all customer payments (USD)
- Pays PT for services (USD wire transfer)
- Holds investor funds
- Pays US-based employees/contractors

**Indonesian PT Bank Account** (Mandiri/BCA):
- Receives service payments from US Corp (USD → IDR conversion)
- Pays Indonesian employee salaries (IDR)
- Pays local expenses (office, utilities, etc.)
- Handles local tax payments

**Money Flow**:
```
Customer ($100K) → US Corp (Stripe) → US Corp Bank (USD)
                       ↓
US Corp → Wire Transfer ($60K) → PT Bank → Convert to IDR
                       ↓
                   PT pays salaries & expenses
                       ↓
            US Corp keeps $40K profit (US)
            PT keeps $10K profit (Indonesia)
```

**Foreign Exchange**:
- Use Wise (formerly TransferWise) or OFX for better rates than banks
- Build 2-3% forex cost into planning
- Consider holding USD in Indonesian multi-currency account (some banks offer this)

## Tax Implications & Transfer Pricing

### Indonesian Taxation (PT)

**Corporate Income Tax**:
- 22% on taxable income (profits)
- Calculate: Revenue from US Corp - Expenses = Taxable Income
- Due: Annual return filed by April 30
- Payments: Monthly installments based on prior year

**WHT (Withholding Tax)**:
- 23% WHT on dividends paid to foreign shareholders (if US Corp is shareholder)
- May be reduced by tax treaty (US-Indonesia tax treaty: 10-15% on dividends)
- Not applicable if founder is shareholder directly

**Employee Taxes**:
- Progressive rates: 5% to 30% (income > IDR 500M)
- PT withholds monthly (PPh 21)
- BPJS contributions (~10% of salary, shared employer/employee)

**VAT** (if applicable):
- 11% VAT on services provided to Indonesian customers
- Export of services to US Corp may be VAT-exempt (0-rated)
- Must register if revenue > IDR 4.8B (~$320K)

### US Taxation (C-Corp)

**Corporate Income Tax**:
- 21% federal corporate tax on taxable income
- Calculate: Revenue from customers - Expenses (including PT service fees) = Taxable Income
- Due: Form 1120 filed by March 15 (or 15th day of 3rd month after year-end)

**State Taxes**:
- Delaware: Franchise tax ($400-500 minimum)
- If you have employees/sales in other states → nexus → state tax obligations
- California: Particularly aggressive (even remote employees create nexus)

**Founder Taxes**:
- If founder takes salary from US Corp: W-2 income, subject to US payroll tax
- If founder lives in Indonesia: May be exempt from US tax under tax treaty (depends on "permanent establishment")
- Consult cross-border tax accountant

**Important**: C-Corps have double taxation (corporate income taxed, then dividends taxed). Don't pay dividends; exit via acquisition or IPO.

### Transfer Pricing (Critical for Both Countries)

**What is Transfer Pricing**:
The price charged between related entities (PT and US Corp) must be at "arm's length" - the same price unrelated parties would charge.

**Why it matters**:
- Indonesian tax authorities want to ensure PT isn't underpricing services (shifting profits to US)
- US tax authorities want to ensure US Corp isn't overpaying (shifting profits to Indonesia)
- Penalties for getting this wrong: 50-200% of underpaid tax + interest

**How to get it right**:
1. **Document the arrangement**: Service agreement with clear scope and pricing
2. **Use comparable pricing**: Research market rates for similar services
   - Indonesian software development: $30-60/hour
   - Markup: 10-20% over cost is generally defensible
3. **Keep contemporaneous documentation**:
   - Time tracking
   - Project documentation
   - Invoices matching actual work
4. **Annual Transfer Pricing Study**: Required if transactions > certain threshold
   - Indonesia: Required for related-party transactions > IDR 20B (~$1.3M)
   - US: Form 5472 disclosure required (no revenue threshold)
5. **Hire specialist**: Transfer pricing accountant/consultant (when revenue > $500K)

**Safe Harbor Approach for Early Stage**:
- PT bills cost + 15% markup
- Document actual costs (payroll, office, etc.)
- Invoice monthly based on actual costs
- Keep detailed time tracking
- Revisit if revenue > $1M or raising Series A

### Tax Treaties (US-Indonesia)

**Benefits**:
- Reduced withholding tax on dividends (10-15% vs 23%)
- Reduced withholding tax on royalties (10% vs 20%)
- Reduced withholding tax on interest (10% vs 20%)
- Permanent establishment rules (may avoid US tax on Indonesian operations)

**To claim treaty benefits**:
- File IRS Form W-8BEN-E (for Indonesian entity claiming treaty benefits)
- Obtain Certificate of Residence from Indonesian tax authority
- Provide to US withholding agent (bank, payor)

**Recommendation**: Engage cross-border tax advisor by Month 6 or when revenue hits $10K/month.

## Fundraising Implications

### US VCs (Path B - $5M-10M seed)

**What they require**:
- Delaware C-Corp (non-negotiable)
- Clean cap table (proper founder vesting, 83(b) elections)
- Clean IP ownership (all IP owned by US Corp)
- Standard investment documents (SAFE, priced round)
- US bank account for fund transfer

**What they'll ask about**:
- "Why is your team in Indonesia?" → Answer: Cost efficiency, founder location
- "Who owns the IP?" → Answer: US Corp owns 100% of IP
- "What are the tax implications?" → Be prepared with cross-border tax structure
- "Is there risk of Indonesian gov't claiming IP?" → Answer: No, proper IP assignment in place

**Due Diligence Requirements**:
- Service agreement (PT → US Corp)
- IP assignment agreement (PT → US Corp)
- Transfer pricing documentation
- Employee IP assignments (all PT employees)
- Cap table (clean, no surprises)
- Corporate records (meeting minutes, consents)

**Investment Structure**:
- VCs invest in US Corp (not PT)
- Receive preferred stock in US Corp
- Standard terms: liquidation preference, anti-dilution, board seat
- Indonesian PT remains wholly-owned by US Corp (or founder)

### SEA VCs (Path A - $1M-2M seed)

**What they require**:
- May accept Indonesian PT initially
- Prefer US Corp but more flexible
- Comfortable with dual-entity structure (common in SEA)

**What they'll ask about**:
- "What's the exit path?" → Answer: US Corp is exit entity, PT is subsidiary
- "Can you move team to Singapore if needed?" → Be flexible, but defend Indonesia cost advantage
- "How will US VCs view this structure?" → Answer: Standard setup, will have US Corp for Series A

**Investment Structure**:
- Option A: Invest in Indonesian PT (simpler initially)
- Option B: Invest in US Corp (if established)
- Will likely require US Corp for Series A (set this up during seed if not already done)

### Cap Table Across Entities

**Typical Structure**:

**US Corp Cap Table**:
- Founder: 8,000,000 shares (80%)
- Employee Option Pool: 1,000,000 shares (10%)
- Seed Investors: 1,000,000 shares (10%, post-$5M @ $50M valuation example)

**PT Ownership**:
- Option A (Early stage): Founder 99%, Nominee 1%
- Option B (Post-US Corp): US Corp 100% (cleanest for exit)

**Recommendation**: Move to Option B (US Corp owns PT 100%) before Series A for cleanest structure.

## Payment Processing & Customer Contracts

### Payment Processing Setup

**Use Stripe via US Corp** (Recommended):
1. Set up Stripe account under US Corp
2. Requires: US bank account (Mercury/Brex), EIN, Delaware registration
3. Customers pay in USD to Stripe → auto-deposits to US bank
4. US Corp then wires service fees to PT monthly

**Why not Stripe in Indonesia**:
- Indonesian Stripe has lower trust from US customers
- USD pricing preferred for global customers
- Simpler accounting (all revenue in USD)

**Alternatives**:
- PayPal (higher fees, less preferred by B2B)
- Direct wire transfer (for enterprise customers)
- Wise Business (good for international invoicing)

### Customer Contracts

**Who signs**:
- US Corp signs all customer contracts (even during bootstrap phase)
- PT never directly contracts with customers

**Contract Structure**:
```
[Customer Name]
and
Authentyc, Inc. (Delaware Corporation)

NOT:
PT Authentyc Indonesia
```

**Why this matters**:
- US/EU customers expect US entity
- Legal enforceability (US courts, arbitration)
- IP ownership clarity
- Payment processing (Stripe under US Corp)

**Key Contract Terms**:
- Governing law: Delaware or New York (not Indonesia)
- Dispute resolution: Arbitration in US
- IP ownership: Customer data license, we own analysis
- Privacy: GDPR/CCPA compliance (even though Indonesia-based)
- Limitation of liability: Standard SaaS caps

### Privacy & Data Protection

**Compliance Required**:
- **GDPR** (EU customers): Data processing, right to deletion, consent
- **CCPA** (California customers): Data disclosure, deletion rights
- **Indonesian Privacy Law** (UU PDP): Compliance for Indonesian operations

**Data Storage**:
- Use US/EU cloud providers (AWS us-east-1, Google Cloud US, EU regions)
- Don't store customer data in Indonesia unless required
- Indonesian PT accesses data as "processor" for US Corp

**Privacy Policy Must Address**:
- Data stored in US (or EU for GDPR)
- PT staff in Indonesia may access for processing (disclose this)
- Standard DPA (Data Processing Agreement) terms for enterprise

**Recommendation**: Use Termly or TermsFeed ($200-500) for privacy policy generation.

## When to Hire Professional Help

### Legal

**Month 0-3 (Bootstrap)**:
- DIY or low-cost: Use Cekindo ($2K-4K) for PT setup
- Templates for basic agreements (freelancer contracts, NDAs)

**Month 4-9 (First Revenue/Fundraising Prep)**:
- Hire startup lawyer for US Corp setup if fundraising
- Cost: $5K-15K for incorporation + seed docs
- Firms: Gunderson Dettmer, Goodwin, Cooley (if raising $5M+)
- Alternative: Clerky ($2K-3K) + spot legal advice

**Month 10+ (Growth)**:
- Ongoing legal counsel ($5K-20K/year retainer)
- Cross-border specialist for entity structuring
- Employment lawyer in Indonesia (for team scaling)

**When raising $1M+**: Get a real lawyer, not DIY.

### Accounting & Tax

**Month 0-3 (Bootstrap)**:
- DIY accounting for PT (Excel, Wave Accounting free)
- Local Indonesian accountant for tax filing ($500-1K/year)

**Month 4-9 (First Revenue)**:
- QuickBooks or Xero for basic accounting
- US accountant for tax filing (~$2K-3K/year)
- Indonesian accountant for PT compliance

**Month 10+ (Growth) or Revenue > $500K**:
- **Transfer pricing specialist** (CRITICAL): $5K-15K for initial study
- Cross-border tax accountant: $5K-10K/year
- Firms: Deloitte, PwC, EY (for transfer pricing), Kruze Consulting (for startups)

**When to get transfer pricing help**: Revenue > $500K or raising Series A

### Corporate Secretary / Compliance

**US Corp**:
- Use Carta/Pulley for cap table + compliance ($1K-3K/year)
- Includes: option grants, 409A valuations, board consents

**PT**:
- Local corporate secretary service ($1K-2K/year)
- Handles: annual filings, meeting minutes, compliance

## Common Mistakes to Avoid

### 1. Wrong Entity Structure
❌ **Mistake**: Only forming PT, signing customer contracts with PT
✅ **Correct**: Form US Corp by Month 6-9, all customer contracts via US Corp

### 2. IP Ownership Issues
❌ **Mistake**: PT creates code, no IP assignment agreement
✅ **Correct**: PT assigns all IP to US Corp immediately when US Corp formed

### 3. Founder Vesting & 83(b)
❌ **Mistake**: Taking founder stock without vesting, forgetting 83(b) election
✅ **Correct**: 4-year vesting with 1-year cliff, file 83(b) within 30 days

### 4. Transfer Pricing Ignored
❌ **Mistake**: PT bills US Corp random amounts, no documentation
✅ **Correct**: Service agreement with market-rate pricing, monthly invoices, time tracking

### 5. Waiting Too Long for US Corp
❌ **Mistake**: Waiting until Series A to set up US Corp → complex restructuring
✅ **Correct**: Set up US Corp by first customer or fundraising prep (Month 6-9)

### 6. No Service Agreement
❌ **Mistake**: PT and US Corp informally work together, no contract
✅ **Correct**: Formal service agreement from Day 1 of dual-entity operation

### 7. Stock Options for Indonesian Employees
❌ **Mistake**: No equity for Indonesian team, or messy PT stock
✅ **Correct**: US Corp stock options granted to PT employees via separate agreement

### 8. Messy Cap Table
❌ **Mistake**: Excel spreadsheet, no vesting schedules, handshake agreements
✅ **Correct**: Carta/Pulley from Day 1, proper docs for all equity

### 9. Indonesian Employment Law Violations
❌ **Mistake**: US-style "at-will" employment, firing without severance
✅ **Correct**: Indonesian employment contracts complying with UU 13/2003, proper severance

### 10. Privacy Law Non-Compliance
❌ **Mistake**: No privacy policy, storing EU data without GDPR compliance
✅ **Correct**: Privacy policy addressing GDPR/CCPA, proper data processing agreements

## Recommended Timeline & Checklist

### Month 0-3: Bootstrap Phase

**Legal**:
- [ ] Form Indonesian PT ($2K-4K)
- [ ] Open Indonesian bank account
- [ ] Get NPWP (tax ID)
- [ ] Register for BPJS (if hiring employees)
- [ ] Basic employment contracts for Indonesian team

**Cost**: $3K-5K setup, $500/month ongoing

### Month 4-9: First Revenue or Fundraising Prep

**Legal**:
- [ ] Form Delaware C-Corp ($1K-2K DIY, $5K-15K with lawyer)
- [ ] File 83(b) election within 30 days of stock issuance
- [ ] Set up cap table on Carta/Pulley
- [ ] Open US bank account (Mercury/Brex)
- [ ] Set up Stripe for payments
- [ ] Get EIN from IRS
- [ ] Draft service agreement (PT → US Corp)
- [ ] Sign IP assignment agreement (PT → US Corp)
- [ ] Update all employee agreements to assign IP to PT (which flows to US Corp)

**Tax/Accounting**:
- [ ] Engage cross-border tax accountant (consultation: $2K-3K)
- [ ] Set up QuickBooks/Xero for both entities
- [ ] Document transfer pricing approach

**Cost**: $8K-20K setup, $1K-2K/month ongoing

### Month 10+: Growth Phase

**Legal**:
- [ ] Annual Delaware franchise tax filing
- [ ] Quarterly board meetings (minutes required)
- [ ] 409A valuation (if issuing options): $2K-5K
- [ ] Review/update service agreement
- [ ] Consider having US Corp acquire PT (100% ownership)

**Tax/Accounting**:
- [ ] Transfer pricing study (if revenue > $500K): $5K-15K
- [ ] Annual tax returns (both US and Indonesia)
- [ ] File Form 5472 (US) for related-party transactions
- [ ] Indonesian transfer pricing documentation (if transactions > IDR 20B)

**Cost**: $10K-30K/year (legal, accounting, compliance)

### Before Fundraising ($1M+)

**Must Have**:
- [ ] Delaware C-Corp formed
- [ ] Clean cap table (all founder stock vested, 83(b) filed)
- [ ] US bank account with Stripe
- [ ] Service agreement (PT → US Corp)
- [ ] IP assignment agreement (PT → US Corp)
- [ ] All customer contracts signed by US Corp
- [ ] Privacy policy (GDPR/CCPA compliant)
- [ ] Terms of Service for product
- [ ] Stock option plan (10-15% pool)
- [ ] Board consents/minutes organized

**Nice to Have**:
- [ ] US Corp owns PT 100% (cleanest structure)
- [ ] Transfer pricing documentation
- [ ] Employment agreements for all team members
- [ ] Cross-border tax opinion letter

## Estimated Costs Summary

### First Year Costs

| Category | Month 0-3 | Month 4-9 | Month 10-12 | Year 1 Total |
|----------|-----------|-----------|-------------|--------------|
| **Legal Setup** | $3K-5K (PT) | $5K-15K (US Corp) | - | $8K-20K |
| **Accounting/Tax** | $500-1K | $2K-3K | $2K-3K | $4.5K-7K |
| **Ongoing Compliance** | $500/mo | $1K-2K/mo | $1K-2K/mo | $12K-24K |
| **Tools** (Carta, registered agent) | - | $1K-2K | $1K-2K | $2K-4K |
| **Total** | $5K-8K | $9K-22K | $4K-7K | $26.5K-55K |

**Budget**: $30K-60K for legal/tax/compliance in Year 1 (assuming you raise funds and set up properly)

### Ongoing Annual Costs (Year 2+)

| Category | Annual Cost |
|----------|-------------|
| **US Corp**: Franchise tax, registered agent, annual report | $2K-3K |
| **PT**: Annual compliance, tax filing, corporate secretary | $2K-3K |
| **Accounting/Bookkeeping** (both entities) | $10K-20K |
| **Legal retainer** (for contracts, HR, compliance) | $5K-15K |
| **Transfer pricing study** (if needed) | $5K-15K |
| **Cap table management** (Carta/Pulley) | $2K-4K |
| **Insurance** (D&O, E&O) | $3K-10K |
| **Total** | $29K-73K/year |

**Budget**: $30K-75K/year for mature dual-entity operations

## Key Contacts & Resources

### Indonesian Service Providers

**Corporate Services**:
- Cekindo (PT setup, visa, compliance): cekindo.com
- Emerhub (PT setup, accounting): emerhub.com

**Law Firms**:
- SSEK Law Firm (top-tier Indonesian corporate)
- Makarim & Taira (employment, M&A)
- Abnr Law (corporate, tax)

**Accounting**:
- Local boutique firms ($500-2K/year)
- Big 4 (Deloitte, PwC, EY, KPMG) for transfer pricing

### US Service Providers

**Incorporation**:
- Stripe Atlas ($500, DIY)
- Clerky ($2K-3K, templates + light support)

**Law Firms** (for funded startups):
- Gunderson Dettmer
- Goodwin Procter
- Cooley LLP
- Orrick
- Wilson Sonsini

**Accounting**:
- Pilot.com (bookkeeping for startups): $500-2K/month
- Kruze Consulting (startups, VC-backed): $2K-5K/month
- Armanino (mid-size tech companies)

**Cap Table**:
- Carta: carta.com ($2K-4K/year)
- Pulley: pulley.com ($1K-3K/year)

**Banking**:
- Mercury: mercury.com (most popular for startups)
- Brex: brex.com (spend management + banking)
- SVB (Silicon Valley Bank): less accessible post-crisis

### Cross-Border Specialists

**Tax/Transfer Pricing**:
- Deloitte (transfer pricing practice)
- PwC (cross-border tax)
- EY (international tax)
- KPMG (transfer pricing)

**Immigration** (if moving to US):
- Fragomen
- Berry Appleman & Leiden

## Final Recommendations

### For Bootstrap Phase (Month 0-6)

**Minimum viable legal structure**:
1. Indonesian PT only
2. Basic employment contracts
3. Customer contracts via PT (not ideal, but acceptable for <$10K revenue)
4. Free privacy policy generator
5. Keep detailed records for future restructuring

**Cost**: $5K-8K

### For Fundraising ($1M+ raise)

**Professional structure required**:
1. Delaware C-Corp + Indonesian PT
2. Service agreement, IP assignment
3. Clean cap table (Carta/Pulley)
4. Proper founder vesting + 83(b)
5. Cross-border tax consultation
6. Startup lawyer ($10K-20K)

**Cost**: $20K-40K

### For Scale (Post-funding, >$500K ARR)

**Mature compliance**:
1. Transfer pricing study + ongoing documentation
2. Annual legal retainer
3. Accounting firm for both entities
4. D&O insurance
5. Regular board meetings
6. Ongoing corporate maintenance

**Cost**: $30K-75K/year

---

## Disclaimer

This document provides general information and is not legal or tax advice. Laws vary by jurisdiction and change frequently. Always consult with qualified legal and tax professionals in both Indonesia and the US before making decisions.

Recommended: Engage cross-border tax accountant by Month 6 or $10K/month revenue, whichever comes first.

Last updated: 2025-12-23
