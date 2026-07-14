# UI Progress - Eco-Share

## Document Status
- Project: `UAS-Fullstack-411251181-BayuFarid`
- Focus: Stitch reference analysis, UI migration tracking, next-agent handoff
- Source of truth: `reference/` HTML exports from Stitch by Google
- Current frontend state: functional Vue app exists, visual system not yet aligned to reference
- Last updated: 2026-07-14

---

## 1. Goal
Align current Vue frontend UI to Stitch-generated reference as close as practical without breaking existing backend integration, auth flow, role flow, and rental transaction flow.

This document tracks:
- reference inventory
- current route to reference mapping
- design system extracted from reference
- architecture decision for migration
- done vs pending work
- batch roadmap
- derivation strategy for pages missing from reference
- execution log for next agent

---

## 2. Current App Baseline
Current frontend already works functionally.

Key existing routes from `src/router/index.js`:
- `/` → public catalog
- `/login` → login
- `/register` → register
- `/items/:id` → item detail
- `/dashboard/owner/items` → owner item management
- `/dashboard/rentals` → renter rental history
- `/dashboard/owner/rentals` → owner incoming rentals
- `/rentals/:id` → rental detail

Current visual system from `src/assets/styles/main.css`:
- dark theme custom CSS
- green accent but not Stitch palette
- component classes like `.hero`, `.card`, `.table-card`, `.btn`
- responsive enough functionally, but not matching reference layout, density, hierarchy, spacing, or mobile patterns

Conclusion:
- logic mostly done
- UI migration still pending
- migration should preserve existing API/store/router structure

---

## 3. Reference Inventory
Reference files analyzed:

1. `reference/Katalog Barang - Eco-Share (Desktop).html`
2. `reference/Katalog Barang - Eco-Share (Mobile).html`
3. `reference/Register - Eco-Share (Desktop).html`
4. `reference/Dashboard Owner: Kelola Barang - Eco-Share (Desktop).html`
5. `reference/Riwayat Rental - Eco-Share (Desktop).html`
6. `reference/Detail Barang - Eco-Share (Mobile).html`

Reference coverage status:
- public catalog: covered desktop + mobile
- register: covered desktop only
- owner item dashboard: covered desktop only
- renter rental history: covered desktop only
- item detail: covered mobile only

Missing reference pages:
- login
- owner rentals dashboard
- rental detail
- owner/mobile variants for owner pages
- renter/mobile rental history

Rule for missing pages:
- derive from nearest existing reference pattern
- keep tokens, spacing, card style, nav pattern, CTA style, status chip style, and information density consistent

---

## 4. Design System Extracted From Reference

### 4.1 Visual identity
Common across all reference files:
- font: Inter
- icon system: Material Symbols Outlined
- style: clean, light, soft enterprise UI
- mood: sustainable tech, premium but friendly
- layout: spacious, rounded, bordered cards, subtle depth
- interaction: soft hover, active scale, sticky bars, segmented chips, status badges

### 4.2 Core colors
Repeated Tailwind tokens across references:
- `primary`: `#006c49`
- `primary-container`: `#10b981`
- `primary-fixed-dim`: `#4edea3`
- `background`: `#f7f9fb`
- `surface`: `#f7f9fb`
- `surface-container-lowest`: `#ffffff`
- `surface-container-low`: `#f2f4f6`
- `surface-container`: `#eceef0`
- `surface-container-high`: `#e6e8ea`
- `surface-container-highest`: `#e0e3e5`
- `outline`: `#6c7a71`
- `outline-variant`: `#bbcabf`
- `on-surface`: `#191c1e`
- `on-surface-variant`: `#3c4a42`
- `error`: `#ba1a1a`
- `error-container`: `#ffdad6`
- `secondary`: `#565e74`
- `secondary-container`: `#dae2fd`
- `tertiary`: `#a43a3a`
- `tertiary-container`: `#fc7c78`

Migration note:
- replace current dark CSS variables with light Stitch token set
- keep CSS variable abstraction in Vue app for easier migration

### 4.3 Radius and spacing
Repeated values:
- radius default: `4px`
- radius lg: `8px`
- radius xl: `12px`
- radius full: `9999px`
- mobile margin: `16px`
- desktop margin: `32px`
- gutter: `16px`
- lg spacing: `24px`
- xl spacing: `32px`
- 2xl spacing: `48px`
- max container: `1280px`

### 4.4 Typography
Repeated semantic scale:
- `headline-xl`: `36/44 700`
- `headline-xl-mobile`: `28/34 700`
- `headline-lg`: `24/32 600`
- `headline-lg-mobile`: `20/28 600`
- `headline-md`: `20/28 600`
- `body-lg`: `18/28 400`
- `body-md`: `16/24 400`
- `body-sm`: `14/20 400`
- `label-md`: `12/16 600`, letter spacing `0.05em`

### 4.5 Reusable UI primitives
Observed repeatedly:
- sticky top nav with thin bottom border
- rounded buttons, primary filled and outline secondary
- chip filters using pill buttons
- soft bordered cards with white background
- status badges with tinted background
- section blocks with strong heading + muted supporting text
- desktop footer with multi-column links
- mobile bottom nav for compact browsing
- sticky bottom action bar on item detail mobile
- dashboard stat cards
- modal sheet / centered CRUD modal

---

## 5. Page-by-Page Reference Analysis

### 5.1 Catalog desktop
Reference: `reference/Katalog Barang - Eco-Share (Desktop).html`

Key structure:
- sticky top nav
- large hero marketing section
- sticky filter/search row below hero
- bento-style 4-column card grid
- product cards with image, status chip, owner, stock, price, CTA
- CTA section for owner onboarding
- detailed footer

Important UI patterns:
- marketing-first homepage, not plain list page
- combines discovery + trust + sustainability messaging
- product cards emphasize price, stock, owner, availability
- mix of soft borders + hover elevation + scale image

Mapping target:
- current `src/views/items/PublicItemsView.vue`

Migration implication:
- homepage should become full landing + catalog hybrid
- current simple hero and grid too minimal
- need filters/search shell even if data filtering starts client-side first

### 5.2 Catalog mobile
Reference: `reference/Katalog Barang - Eco-Share (Mobile).html`

Key structure:
- compact sticky top bar
- mobile page heading
- horizontal category chips
- vertical stacked product cards
- bottom nav
- floating action button

Important UI patterns:
- touch-first vertical list
- no large hero on mobile reference
- quick rent CTA on each card
- availability shown near image as colored chip

Mapping target:
- current `src/views/items/PublicItemsView.vue`
- likely shared responsive variant using breakpoints

Migration implication:
- desktop and mobile for same route need different composition
- mobile should collapse hero and prioritize list speed

### 5.3 Register desktop
Reference: `reference/Register - Eco-Share (Desktop).html`

Key structure:
- sticky top nav
- split layout: left value proposition, right form card
- role selection card grid inside form
- inline error area
- footer

Important UI patterns:
- registration framed as brand onboarding, not plain auth form
- role choice visually important
- left side explains sustainability + trust

Mapping target:
- current `src/views/auth/RegisterView.vue`

Migration implication:
- current register page too small/simple
- role selection component should be upgraded first because backend role flow already exists
- same layout style can derive login page later

### 5.4 Owner items desktop
Reference: `reference/Dashboard Owner: Kelola Barang - Eco-Share (Desktop).html`

Key structure:
- sticky dashboard nav
- heading + add button
- stats cards row
- sustainability score panel
- large inventory table card
- CRUD modal with form

Important UI patterns:
- management page uses enterprise dashboard tone
- stats + table + modal pattern
- hover-revealed row actions
- table shell more important than current always-visible inline CRUD

Mapping target:
- current `src/views/items/OwnerItemsView.vue`

Migration implication:
- current page already has correct data flow
- easiest high-value migration candidate after global tokens
- form should move from always-visible card into modal/drawer pattern to match reference

### 5.5 Rental history desktop
Reference: `reference/Riwayat Rental - Eco-Share (Desktop).html`

Key structure:
- sticky nav
- page intro
- stat summary cards
- vertical rental cards by status
- contextual actions per status

Important UI patterns:
- uses rich cards instead of table
- status drives visual tone and actions
- rental metadata grouped in 2-column info blocks

Mapping target:
- current `src/views/rentals/MyRentalsView.vue`

Migration implication:
- current structure already card-based, so lower risk
- needs better hierarchy, imagery placeholder strategy, stat summary strip, status-specific visual treatment

### 5.6 Item detail mobile
Reference: `reference/Detail Barang - Eco-Share (Mobile).html`

Key structure:
- sticky action top bar
- large media hero
- rounded top content sheet
- status + rating + price + stock
- embedded rental controls
- eco impact box
- sticky bottom rental summary CTA
- success overlay modal

Important UI patterns:
- mobile-first purchase flow
- rental form integrated into page, not detached generic card
- bottom bar critical for conversion

Mapping target:
- current `src/views/items/ItemDetailView.vue`

Migration implication:
- current detail page functionally correct but visually far from reference
- should become one of highest-priority pages because rental action happens here

---

## 6. Current Route → Reference Mapping Matrix

| Current Route | Current Vue View | Reference Coverage | Status | Migration Note |
|---|---|---|---|---|
| `/` | `src/views/items/PublicItemsView.vue` | direct desktop + mobile | pending | biggest homepage/catalog redesign needed |
| `/register` | `src/views/auth/RegisterView.vue` | direct desktop | pending | can derive mobile from same split card stacked layout |
| `/login` | `src/views/auth/LoginView.vue` | no direct reference | derived | use register layout minus role cards |
| `/items/:id` | `src/views/items/ItemDetailView.vue` | direct mobile | pending | desktop variant must be inferred from same sections |
| `/dashboard/owner/items` | `src/views/items/OwnerItemsView.vue` | direct desktop | pending | high-confidence adaptation |
| `/dashboard/rentals` | `src/views/rentals/MyRentalsView.vue` | direct desktop | pending | convert to richer status cards |
| `/dashboard/owner/rentals` | `src/views/rentals/OwnerRentalsView.vue` | no direct reference | derived | combine owner dashboard shell + rental history card system |
| `/rentals/:id` | `src/views/rentals/RentalDetailView.vue` | no direct reference | derived | use item detail structure + history/status sections |

---

## 7. Missing Page Derivation Strategy

### 7.1 Login page
Base from:
- `reference/Register - Eco-Share (Desktop).html`

Derive by:
- keep same top nav and footer
- keep same split layout
- left panel can reuse sustainability/trust copy
- right card becomes login form only
- secondary link points to register

### 7.2 Owner rentals page
Base from:
- layout shell from `reference/Dashboard Owner: Kelola Barang - Eco-Share (Desktop).html`
- card/status rhythm from `reference/Riwayat Rental - Eco-Share (Desktop).html`

Derive by:
- top stats for pending, active, returned, cancelled incoming rentals
- list cards or table-card hybrid
- action buttons for approve/monitor/return state if backend later expands
- current backend only supports viewing owner rentals, so visual actions must not invent unsupported API calls

### 7.3 Rental detail page
Base from:
- information hierarchy from `reference/Detail Barang - Eco-Share (Mobile).html`
- status/action sections from `reference/Riwayat Rental - Eco-Share (Desktop).html`

Derive by:
- hero or header with item summary
- timeline/history section
- status badge prominence
- conditional return/cancel button using existing backend rules

### 7.4 Desktop item detail
Base from:
- mobile item detail content blocks
- catalog desktop spacing and wide layout

Derive by:
- two-column layout on desktop
- left media, right rental summary card
- sticky rental panel optional

---

## 8. Architecture Decision For Migration

### Decision
Keep existing Vue app architecture and API/store/router flow.
Do not rewrite app to Tailwind-only full refactor right now.
Adopt Stitch visual system through current CSS layer and targeted component/page refactors.

### Why
- existing app already functional
- user asked for staged work
- fastest safe path is minimal structural rewrite with maximum visual alignment
- avoids full dependency/design-system migration risk
- preserves reusable Vue components and backend-connected forms

### Implementation strategy
1. Replace global CSS tokens in `src/assets/styles/main.css` with Stitch palette and spacing.
2. Add reusable layout utility classes matching reference patterns.
3. Refactor shared layout components first.
4. Refactor page shells batch-by-batch.
5. Keep API/store/forms intact unless UI needs shape changes.

### Guardrails
- no backend contract changes
- no route changes unless needed for UX only
- no fake actions beyond current API support
- preserve auth/role guards in router
- preserve responsive behavior and improve toward reference

---

## 9. Batch Roadmap

### Batch 0 — Documentation and mapping
Scope:
- analyze reference
- create progress doc
- define architecture and roadmap

Output:
- this document

Status:
- in progress until file committed and tracked

### Batch 1 — Global design system and shared shell
Scope:
- update `src/assets/styles/main.css`
- align light theme tokens to Stitch palette
- refactor shared header/app shell/footer styles
- create utility classes for chips, stat cards, table cards, sticky bars

Target files:
- `src/assets/styles/main.css`
- `src/components/layout/AppHeader.vue`
- `src/components/layout/AppShell.vue`
- maybe shared common components

Success criteria:
- app switches from dark custom theme to light Stitch-like baseline
- shared navigation and container spacing closer to reference

### Batch 2 — Public discovery flow
Scope:
- refactor public catalog page
- improve item cards
- align item detail page to reference, especially rental CTA flow

Target files:
- `src/views/items/PublicItemsView.vue`
- `src/components/items/ItemCard.vue`
- `src/views/items/ItemDetailView.vue`
- `src/components/forms/RentalForm.vue`

Success criteria:
- `/` visually matches desktop/mobile catalog patterns
- `/items/:id` reflects mobile reference hierarchy and sticky CTA behavior as feasible

### Batch 3 — Auth pages
Scope:
- refactor register page to split onboarding layout
- derive login page from register system
- improve auth form states and role selection styling

Target files:
- `src/views/auth/RegisterView.vue`
- `src/views/auth/LoginView.vue`
- `src/components/forms/RegisterForm.vue`
- `src/components/forms/LoginForm.vue`

Success criteria:
- auth pages feel same family as Stitch reference
- role selection is clear and prominent

### Batch 4 — Owner inventory dashboard
Scope:
- refactor owner items page to dashboard style
- add stats strip
- move CRUD form into modal or modal-like panel

Target files:
- `src/views/items/OwnerItemsView.vue`
- `src/components/forms/ItemForm.vue`

Success criteria:
- management UX aligns with desktop owner reference
- create/edit flow cleaner

### Batch 5 — Rental pages
Scope:
- refactor renter rental history page
- derive owner rentals page
- derive rental detail page

Target files:
- `src/views/rentals/MyRentalsView.vue`
- `src/views/rentals/OwnerRentalsView.vue`
- `src/views/rentals/RentalDetailView.vue`

Success criteria:
- rental flows share one coherent status-driven UI language
- pages remain bound to backend rental states: `PENDING`, `ACTIVE`, `RETURNED`, `CANCELLED`

### Batch 6 — Polish and verification
Scope:
- responsive cleanup
- empty/loading/error states restyle
- build/test
- git status summary

Success criteria:
- no broken flow
- consistent tokens and spacing across app

---

## 10. Done / Pending Tracker

### Done
- frontend feature flow implemented
- backend integration implemented
- auth and role guards implemented
- public catalog, owner items, rentals, rental detail routes implemented
- Stitch reference files analyzed
- route-to-reference mapping drafted
- architecture direction chosen: preserve Vue architecture, migrate visual layer in batches

### Pending
- run build/test after each major batch
- run `git status` after changes

---

## 11. Risks and Constraints
- current reference uses Tailwind CDN, but app uses scoped Vue + custom CSS
- exact pixel parity not realistic without larger rewrite
- reference contains placeholder images and sample stats not always present in backend data
- backend does not expose some dashboard metrics directly, so stats may need computed client-side from loaded lists
- owner rentals page has no exact reference, must be inferred carefully
- current item model may not include image URLs, so image-heavy reference sections need graceful fallback blocks or placeholder media treatment

---

## 12. Data/Backend Notes For UI Agent
Useful backend-aligned constraints:
- roles: `OWNER`, `RENTER`
- item status: `AVAILABLE`, `UNAVAILABLE`, `INACTIVE`
- rental status: `PENDING`, `ACTIVE`, `RETURNED`, `CANCELLED`
- renter can create rental from item detail
- renter can return rental via existing endpoint
- renter can cancel rental via existing endpoint
- owner items CRUD exists
- owner rentals currently viewable

Do not design unsupported mutation actions for owner rentals unless backend expanded.

---

## 13. Suggested Component Refactor Direction
Preferred reusable pieces to add or reshape during UI migration:
- `StitchSectionHeader`
- `StatusBadge`
- `StatCard`
- `FilterChipRow`
- `StickyActionBar`
- `PageHero`
- `DashboardTableShell`
- `EmptyState` visual refresh only if existing reusable component enough

Note:
- reuse existing base components where possible
- minimal diff first
- avoid unnecessary new dependency

---

## 14. Execution Log

### 2026-07-14
- analyzed Stitch reference inventory in `reference/`
- compared reference coverage against current Vue routes in `src/router/index.js`
- reviewed current page baseline in:
  - `src/views/items/PublicItemsView.vue`
  - `src/views/auth/RegisterView.vue`
  - `src/views/items/OwnerItemsView.vue`
  - `src/views/rentals/MyRentalsView.vue`
  - `src/views/items/ItemDetailView.vue`
- identified main mismatch: current app functional, but still dark/custom and structurally simpler than Stitch
- chose staged migration path using existing Vue/CSS architecture
- created this tracking document for next-agent continuity
- completed Batch 1 baseline shell work in:
  - `src/assets/styles/main.css`
  - `src/components/layout/AppHeader.vue`
  - `src/components/layout/AppShell.vue`
- switched global visual system to light Stitch-style baseline
- added responsive shared footer and refined top navigation grouping
- fixed input surfaces so forms now match light shell direction
- completed Batch 2 public discovery flow in:
  - `src/views/items/PublicItemsView.vue`
  - `src/components/items/ItemCard.vue`
  - `src/views/items/ItemDetailView.vue`
  - `src/components/forms/RentalForm.vue`
- rebuilt public catalog into Stitch-style hero, chip filters, richer cards, and CTA section
- aligned item detail hierarchy to reference-inspired media, stats, rental panel, and sticky action bar
- refreshed rental form presentation without changing backend payload flow
- verified Batch 2 with build, tests, and git status
- completed Batch 3 auth page refactor in:
  - `src/views/auth/RegisterView.vue`
  - `src/views/auth/LoginView.vue`
  - `src/components/forms/RegisterForm.vue`
  - `src/components/forms/LoginForm.vue`
- converted register page into split onboarding layout with clearer role guidance
- derived login page from same auth shell with role-aware messaging and lighter onboarding context
- restyled auth forms with prominent role cards, guidance blocks, and stronger submit/footer hierarchy
- verified Batch 3 with build, tests, and git status
- completed Batch 4 owner inventory dashboard refactor in:
  - `src/views/items/OwnerItemsView.vue`
  - `src/components/forms/ItemForm.vue`
  - `src/assets/styles/main.css`
- rebuilt owner inventory page into dashboard layout with stat cards, richer inventory table, and modal-like CRUD flow
- refreshed item form into guided editor panel with status quick-select actions and clearer hierarchy
- verified Batch 4 with build, tests, and git status
- completed Batch 5 rental page refactor in:
  - `src/views/rentals/MyRentalsView.vue`
  - `src/views/rentals/OwnerRentalsView.vue`
  - `src/views/rentals/RentalDetailView.vue`
  - `src/assets/styles/main.css`
- rebuilt renter rental history into stat-led dashboard cards with clearer status actions and detail entrypoints
- derived owner rental monitoring page from same dashboard language with summary stats and richer transaction table
- refactored rental detail into hero plus audit layout while preserving renter-only return and cancel actions
- verified Batch 5 with build, tests, and git status

---

## 15. Next Recommended Action
Start Batch 6:
- polish responsive edge cases across migrated pages
- restyle remaining empty/loading/error states where needed
- run final build/test sweep
- review final `git status` summary

Reason:
- Batch 5 rental pages finished and verified
- remaining work is consistency cleanup across batches, not new route migration
- final pass can reuse design tokens and patterns already established in Batches 1-5
