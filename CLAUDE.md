# OffMap — Claude Code Project Instructions

## 🧠 HOW TO WORK ON THIS PROJECT

### Always Plan Before Executing
- For any task involving more than 2 files, use plan 
  mode first
- Present the plan, wait for approval, then execute
- Never start coding without understanding the full 
  scope of the change

### Use Subagents for Parallel Work
- When building multiple independent pages or components, 
  spawn subagents to work in parallel
- Example: Homepage, About Us, and Blog can be built 
  simultaneously by 3 subagents
- Never use subagents for tasks with dependencies 
  (booking flow must be sequential)

### Git Discipline
- Create a new branch for every feature or page
- Branch naming: feature/homepage, feature/trip-listing,
  fix/nav-mobile etc
- Commit frequently with clear messages following 
  Conventional Commits:
  feat: add trip listing page
  fix: mobile nav overflow issue
  chore: update dependencies
- Never commit directly to main
- Always create a PR for review before merging

### Git Rules
- Never auto-create branches with claude/ prefix
- Always work on the current active branch unless 
  explicitly told to create a new one
- When told to create a branch, follow this naming:
  feature/homepage
  feature/trip-listing
  fix/nav-mobile
  chore/dependencies
- Always confirm which branch you're on before 
  making any commits

### Before Marking Any Task Done
- Test on mobile (375px) AND desktop (1440px)
- Check loading states exist
- Check error states exist
- Verify TypeScript has no errors (npm run type-check)
- Verify no console errors in browser
- Check animations work and respect 
  prefers-reduced-motion

---

## 📋 PROJECT OVERVIEW

Travel experiences website for OffMap India (offmap.in)
Adventure travel company — group trips, day trips, 
school trips, retreats, stays, learning experiences
across Himachal Pradesh and Rajasthan.

### Phase 1 (Current)
Static site with listing pages and enquiry forms.
Deadline: April 10th

### Phase 2 (Next)
Booking flow, Razorpay, admin dashboard.
Deadline: May 3rd

---

## 🛠 TECH STACK

- Framework: Next.js 15 (App Router only)
- CMS: Payload CMS 3.0 (same repo, /admin route)
- Database: SQLite (dev) → PostgreSQL (prod)
- Styling: Tailwind CSS only
- Animations: GSAP + ScrollTrigger + Lenis
- Payments: Razorpay (Phase 2)
- Email: Resend
- Forms: React Hook Form + Zod
- Icons: Lucide React
- Deployment: Vercel
- React Compiler: enabled (automatic memoization)
- Bundler: Turbopack
- Never manually write useMemo/useCallback/memo — 
  React Compiler handles this automatically

---

## 🏗 ARCHITECTURE RULES

### File Structure
```
/app
  /(frontend)        ← all public pages
    /page.tsx        ← homepage
    /trips/[slug]/   ← dynamic trip detail
    /stays/[slug]/   ← dynamic stay detail
    /blog/[slug]/    ← dynamic blog post
  /(payload)         ← admin panel (don't touch)
/collections         ← Payload schemas
/components
  /ui                ← reusable primitives
  /sections          ← page sections (Hero, Cards)
  /layout            ← Navbar, Footer
/lib                 ← utils, constants, helpers
/hooks               ← custom React hooks
/public              ← static assets only
```

### Data Architecture
- Locations collection drives ALL dynamic routes
- Never hardcode location names (Himachal, Rajasthan)
  in any logic — always fetch from CMS
- Trip dates live in Batches collection, never in Trips
- One trip can have many batches (date + seats)
- Bookings reference a Batch, not a Trip directly

### Component Rules
- Functional components only, no class components
- Named exports for all components
- Default exports for pages only
- Props must always be typed with TypeScript interfaces
- Never use `any` type
- Co-locate component styles, tests and types

### Routing
- App Router only, never Pages Router
- Dynamic routes use [slug] based on Payload slugs
- All location-based routes: /trips/[location]/[slug]
- This means adding a new location = zero code changes

---

## 🎨 DESIGN SYSTEM

### Colors
- Primary Blue: #1B4FD8
- Yellow: #FFD60A  
- White: #FFFFFF
- Off-white background: #F8F9FA
- Dark text: #0F172A
- Muted text: #64748B
- Border: #E2E8F0

### State-Based Accent Colors
- Himachal Pradesh: cool blue tones #1B4FD8, #93C5FD
- Rajasthan: warm amber tones #FFD60A, #F59E0B
- Future locations get their own accent palette

### Typography
- Heading font: Poppins (700, 600, 500)
- Body font: DM Sans (400, 500)
- Load via next/font, never external CDN

### Spacing
- Use Tailwind spacing scale consistently
- Section padding: py-16 md:py-24
- Container max-width: max-w-7xl mx-auto px-4

### Component Patterns
- Cards: white background, subtle shadow, 
  rounded-xl, hover lift
- Buttons: primary = yellow bg + dark text, 
  secondary = blue bg + white text
- Tags/badges: rounded-full, small text
- Seats left badge: yellow background, urgent feel

---

## 📱 RESPONSIVE DESIGN

- Mobile first always — start at 375px
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Every component must be tested at:
  - 375px (small phone)
  - 768px (tablet)  
  - 1440px (desktop)
- Touch targets minimum 44px height on mobile
- No horizontal scroll at any breakpoint
- Images must use next/image always

---

## 🔒 SECURITY

- Never expose API keys in client components
- All sensitive keys in .env.local only
- Payload access controls on every collection:
  - Public read for trips, stays, blogs, reviews
  - Authenticated write for everything
  - Admin only for bookings and enquiries
- Input sanitization on all form submissions
- Rate limiting on enquiry form endpoints
- Razorpay webhook signature verification (Phase 2)
- Never trust client-side seat count — 
  always verify server-side (Phase 2)

---

## ✨ ANIMATIONS

- Use GSAP ScrollTrigger for scroll animations
- Use Lenis for smooth scrolling
- Always respect prefers-reduced-motion:
  if (window.matchMedia(
    '(prefers-reduced-motion: reduce)').matches
  ) skip animations
- Animation timing: 0.6s ease for most transitions
- Stagger: 0.15s between list items
- Never block the main thread with animations
- Initialize Lenis in root layout only

---

## 🧪 QUALITY CHECKLIST

Before any PR is created, verify:
- [ ] No TypeScript errors (npm run type-check)
- [ ] No unused imports
- [ ] Mobile tested at 375px
- [ ] Desktop tested at 1440px  
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Images use next/image
- [ ] Fonts loaded via next/font
- [ ] No hardcoded location names
- [ ] Animations respect reduced motion
- [ ] Form validation works
- [ ] Console is clean (no errors/warnings)

---

## 🚫 NEVER DO

- Never use pages/ router
- Never use inline styles
- Never use CSS-in-JS
- Never use `any` in TypeScript
- Never hardcode trip/location content in code
- Never store credentials in code
- Never commit .env files
- Never skip error handling
- Never use npm install without checking 
  if package already exists
- Never create files outside the defined 
  folder structure
- Never directly modify files in (payload) folder

---

## 💼 BUSINESS LOGIC

### Enquiry Flow (Phase 1)
- School trips → enquiry form only
- Retreats → enquiry form only
- All enquiries → email to info@offmap.in 
  AND WhatsApp to 9211471385
- No payment for enquiry-based trips

### Booking Flow (Phase 2)
- Group trips and day trips → live booking
- Stays → separate booking flow
- Payment: 30% advance + 5% GST via Razorpay
- Remaining 70% collected offline before trip
- Max 15 seats per batch
- Seat count must be verified server-side before 
  payment is initiated

### Content Management
- All locations managed via CMS (no hardcoding)
- All trips managed via CMS
- Client updates monthly — must be non-technical 
  friendly
- Adding a new location = zero code changes needed