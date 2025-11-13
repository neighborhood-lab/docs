# Proposed Documentation Structure

## PHILOSOPHY
- End-user first: People running care agencies, not developers
- Big picture first: What it is, why it matters, then how
- No jargon: Plain English, explain technical terms
- No duplication: One canonical place for each topic
- Don't bury the lede: Most important info first

## NEW STRUCTURE (Radical Simplification)

### 1. START HERE (5-7 docs)
The essential reading for anyone new to Care Commons

1. **What is Care Commons?** (NEW - written from first principles)
   - What problem does it solve?
   - Who is it for?
   - What makes it different?
   - Real-world examples
   
2. **Is Care Commons Right for You?** (NEW - decision framework)
   - Types of care agencies it serves
   - What it does well vs what it doesn't
   - Alternatives and when to use them
   
3. **Getting Started** (consolidated from 11 quickstarts)
   - Quick demo (5 minutes)
   - Full setup (30 minutes)
   - Your first visit workflow
   
4. **Core Concepts** (NEW - explains fundamentals)
   - Clients vs Caregivers vs Coordinators (roles explained simply)
   - Visits vs Shifts (what's the difference?)
   - Scheduling vs Time Tracking vs Billing (the workflow)
   - Compliance vs Operations (why both matter)

5. **Showcase** (keep, but improve)
   - See it in action

### 2. USING CARE COMMONS (12-15 docs organized by user role)

**For Care Coordinators:**
- Managing clients and caregivers
- Creating and managing visits
- Handling scheduling conflicts
- Running reports

**For Caregivers:**
- Mobile app basics
- Clocking in/out for visits
- Recording visit notes
- Viewing your schedule

**For Administrators:**
- Compliance and state requirements
- Billing and invoicing
- Quality assurance
- Managing your team

### 3. DEPLOYING & RUNNING (5-8 docs)
ONE deployment guide, not 6

1. **Deployment Overview** (NEW - consolidated)
   - Self-hosted vs cloud options explained
   - What you'll need (prerequisites)
   - Security considerations
   
2. **Deploy to Vercel** (step-by-step, one page)
3. **Deploy to your own server** (step-by-step, one page)
4. **Database setup** (consolidated)
5. **Monitoring and backups**
6. **Troubleshooting common issues**

### 4. TECHNICAL REFERENCE (organized, not alphabetical soup)

**Architecture:**
- System overview
- How data flows
- Security model

**API Documentation:**
- Authentication
- Endpoints by feature area
- Examples

**Compliance:**
- State-by-state requirements (consolidated into one doc per state)
- How Care Commons handles compliance
- Audit trails

### 5. FOR DEVELOPERS (moved to end, not mixed in)
- Contributing guide
- Development setup
- Architecture deep-dives
- Extending Care Commons

---

## DOCUMENTS TO CONSOLIDATE OR REMOVE

### Consolidate into "Deployment Overview":
- deployment.html
- deployment-quickstart.html  
- deployment-quick-start.html
- deployment-quick-reference.html
- deployment-ready.html
- deployment-options.html
- docs-deployment-guide.html
- docs-deployment-setup-complete.html
- production-deployment.html
- vercel-quickstart.html
- cloudflare-deployment.html

### Move to Developer Section (not end-user docs):
- All claude-*.html files (26+ files - these are build artifacts)
- implementation-*.html files
- *-summary.html files (dev logs, not user docs)
- hardening-summary.html
- autonomous-session-summary.html

### Consolidate per-feature:
Instead of having readme.html + quickstart.html + implementation.html + summary.html
for each vertical, have ONE well-written guide per vertical.

Example: For Time Tracking & EVV:
- BEFORE: 7 separate files
- AFTER: 1 comprehensive guide with clear sections

---

## WRITING PRINCIPLES FOR REWRITES

1. **Start with why** - "Home care agencies need to track caregiver visits for billing and compliance" not "This module implements EVV functionality"

2. **Use analogies** - "Think of a visit like a shift at a restaurant - it has a scheduled time, an actual clock-in/out time, and tasks to complete"

3. **Define before using** - First time using "EVV"? Explain it: "Electronic Visit Verification (EVV) - automatically recording when and where a caregiver checks in for a visit"

4. **Show, don't tell** - Include screenshots, examples, real scenarios

5. **One concept per section** - Don't mix "how scheduling works" with "how to fix scheduling bugs"

6. **Progressive disclosure** - Basic info first, advanced info later with clear headers

