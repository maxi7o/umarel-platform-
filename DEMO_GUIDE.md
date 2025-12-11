# Umarel Demo Guide - 3 User Personas

## Meeting Preparation Checklist
- [ ] Database seeded with demo data
- [ ] All 3 user flows tested
- [ ] Screenshots/recordings ready
- [ ] Key metrics visible

---

## Persona 1: Service Consumer (María)
**Profile**: Homeowner needs bathroom renovation

### Demo Flow (5 minutes)

#### Step 1: Landing & Discovery (30 sec)
- URL: `http://localhost:3000/es`
- Show: Beautiful landing page with value proposition
- Highlight: "Ahorra hasta 40% con ayuda de la comunidad"

#### Step 2: Create Service Request (1 min)
- URL: `http://localhost:3000/es/requests/create`
- Fill form:
  - Title: "Renovar baño pequeño"
  - Description: "Necesito renovar un baño de 3x2m. Incluye cambio de azulejos, sanitarios y grifería"
  - Location: Use autocomplete → "Palermo, Buenos Aires"
  - Photo: Upload bathroom image
- Submit → Redirects to Wizard

#### Step 3: Wizard Optimization (2 min)
- URL: `http://localhost:3000/es/wizard/[sliceId]`
- Show:
  - Welcome message from AI
  - Question carousel (3 questions visible)
  - Answer first question: "En 2 semanas"
  - AI refines the request
  - Slice Card updates in real-time
- Highlight:
  - "Skip Wizard" button (optional)
  - File attachment capability
  - Smart AI adapts to answers

#### Step 4: Browse Market (30 sec)
- Click "Skip Wizard and Publish"
- URL: `http://localhost:3000/es/browse`
- Show: Request now visible in marketplace
- Providers can see and quote

#### Step 5: Receive Quotes (1 min)
- URL: `http://localhost:3000/es/requests/[requestId]`
- Show:
  - Multiple quotes from providers
  - AI-optimized slices
  - Community suggestions (umarels helped!)
  - Estimated savings: "Ahorraste $45,000 ARS"

---

## Persona 2: Service Provider (Carlos)
**Profile**: Experienced plumber/contractor

### Demo Flow (4 minutes)

#### Step 1: Browse Opportunities (1 min)
- URL: `http://localhost:3000/es/browse`
- Show:
  - List of service requests
  - Filter by category, location
  - AI-optimized slices (clear scope)
- Highlight:
  - Requests are clearer thanks to Wizard
  - Less back-and-forth needed

#### Step 2: View Request Details (1 min)
- Click on María's bathroom request
- URL: `http://localhost:3000/es/requests/[requestId]`
- Show:
  - Detailed description
  - Location
  - Photos
  - AI-generated slices
  - Community insights

#### Step 3: Submit Quote (1.5 min)
- Click "Submit Quote"
- Fill quote form:
  - Amount: $120,000 ARS
  - Message: "Tengo 10 años de experiencia..."
  - Estimated delivery: 5 days
- Submit
- Show: Quote appears in request

#### Step 4: Provider Profile (30 sec)
- URL: `http://localhost:3000/es/profile/[providerId]`
- Show:
  - Average rating: 4.8/5 ⭐
  - Total jobs completed: 47
  - Aura Level: Gold
  - Reviews from clients
  - Recommendation rate: 95%

---

## Persona 3: Umarel (Community Helper - Diego)
**Profile**: Retired contractor sharing knowledge

### Demo Flow (4 minutes)

#### Step 1: Discover Requests (30 sec)
- URL: `http://localhost:3000/es/browse`
- Show: Browse requests as a community member
- Highlight: "Help others save money, earn Aura"

#### Step 2: Engage in Wizard (2 min)
- Click on a request in Wizard phase
- URL: `http://localhost:3000/es/wizard/[sliceId]`
- Show:
  - Join the conversation
  - Provide expert insights
  - AI incorporates suggestions
  - Slice Card updates
- Example message:
  - "Recomiendo usar cerámica nacional en vez de importada. Ahorras 30% sin perder calidad"
- Show: Message marked as "helpful"

#### Step 3: Earning Aura (1 min)
- URL: `http://localhost:3000/es/wallet`
- Show:
  - Aura points: 847
  - Level: Silver → Gold (próximo)
  - Savings generated: $234,500 ARS
  - Today's earnings: $1,250 ARS
  - Highlight: "Top 50 umarels share 3% of daily revenue"

#### Step 4: Daily Payout (30 sec)
- Show wallet transactions
- Explain:
  - Helpful messages → Aura points
  - Aura points → Daily ranking
  - Top 50 → Share revenue pool
  - Automatic payouts
- Highlight: "Passive income for sharing knowledge"

---

## Key Metrics Dashboard (Admin View)
**URL**: `http://localhost:3000/admin/umarel-launch`

### Show:
- Today's Pool: $42,350 ARS
- Top Contributors (live)
- Total Savings Generated: $1.2M ARS
- Active Requests: 23
- Completed Services: 156
- Average Satisfaction: 4.7/5 ⭐

---

## Demo Script Highlights

### Opening (30 sec)
"Umarel is a marketplace that makes home services 40% cheaper by leveraging community knowledge. We have 3 types of users..."

### Value Propositions

**For Consumers:**
- Save 30-40% on services
- AI-optimized requests
- Vetted providers
- Community-backed recommendations

**For Providers:**
- Clearer project scopes
- Less time wasted on quotes
- Higher conversion rates
- Build reputation with ratings

**For Umarels:**
- Earn money sharing knowledge
- Passive income (daily payouts)
- Gamified experience (Aura levels)
- Help community save money

### Closing (1 min)
"The magic is in the Wizard - AI + Community = Better outcomes for everyone. Consumers save money, providers get better leads, and umarels earn passive income."

---

## Technical Setup Before Demo

1. **Seed Database**
   ```bash
   npm run seed
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Create Demo Users**
   - Consumer: maria@demo.com
   - Provider: carlos@demo.com
   - Umarel: diego@demo.com

4. **Prepare Demo Data**
   - 3-5 sample requests
   - 2-3 quotes per request
   - Wizard conversations
   - Ratings and reviews

5. **Test All Flows**
   - Create request → Wizard → Publish
   - Browse → Quote → Accept
   - Wizard → Comment → Earn Aura

---

## Backup Slides (If Demo Fails)

1. Architecture diagram
2. Screenshots of key features
3. Metrics/traction (if any)
4. Roadmap

---

## Questions to Anticipate

**Q: How do you prevent spam/abuse?**
A: Aura system + ratings + moderation

**Q: How do you make money?**
A: 3% transaction fee on completed services

**Q: What's your competitive advantage?**
A: AI + Community = Unique optimization layer

**Q: How do you scale?**
A: Self-reinforcing loop - more umarels = better optimization = more users

**Q: What about liability?**
A: Providers are independent contractors, we're a marketplace

---

## Post-Demo Follow-up

- Share demo link
- Provide access to staging environment
- Send metrics dashboard
- Schedule follow-up call
