# OmniWay

> **Universal Crowdsourced Physical Accessibility Directory with Time-Audited Verification**

[![Live Deployment](https://img.shields.io/badge/Vercel-omniway.vercel.app-blue?style=flat&logo=vercel)](https://omniway.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20v8-brightgreen.svg)](https://www.mongodb.com/atlas)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20%2F%20AAA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)

**OmniWay** tracks crowd-verified physical accessibility features (wheelchair ramps, elevators/lifts, accessible restrooms, and step-free entrances) with a central differentiator: **explicitly tracking, calculating, and highlighting the elapsed time since each individual accessibility feature was last verified.**

Built strictly to **WCAG 2.1 Level AA** standards with AAA text contrast tokens, robust input validation, resilient error handling, and keyboard-first accessibility. Pre-seeded with 28 authentic venues across Bengaluru, Karnataka, India.

- **Live Web Application:** [https://omniway.vercel.app](https://omniway.vercel.app)
- **Live API Endpoint:** [https://omniway.vercel.app/api/places](https://omniway.vercel.app/api/places)
- **GitHub Repository:** [https://github.com/JeevanRishiP/OmniWay-CIA-Sem3.git](https://github.com/JeevanRishiP/OmniWay-CIA-Sem3.git)

---

## 1. System Architecture

```text
                     ┌───────────────────────────────────────────────┐
                     │          Client (React 19 + Vite)             │
                     │  - Tailwind CSS (WCAG AAA contrast tokens)     │
                     │  - React Router DOM v7                        │
                     │  - TanStack Query v5 (cache + optimistic UI)  │
                     └───────────────────────┬───────────────────────┘
                                             │ HTTPS / JSON REST
                                             ▼
                     ┌───────────────────────────────────────────────┐
                     │          Node.js / Express Gateway            │
                     │  - Helmet (CSP, HSTS, frameguard)             │
                     │  - CORS (whitelisted client origins)          │
                     │  - express-rate-limit (100 req/15min on write)│
                     │  - Zod Request Validation Middleware          │
                     │  - Centralized Error Handler (RFC 7807)       │
                     └───────┬───────────────────────────────┬───────┘
                             │                               │
             ┌───────────────┴───────────────┐               │
             ▼                               ▼               ▼
 ┌──────────────────────┐         ┌──────────────────────┐ ┌───────────────┐
 │ Places Controller    │         │ Verify Controller    │ │ Health/Status │
 └───────────┬──────────┘         └──────────┬───────────┘ └───────────────┘
             │                               │
             ▼                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │              MongoDB Atlas via Mongoose ODM               │
 │  - places collection (embedded features + geo index)      │
 │  - verification_notes collection (audit log, indexed)     │
 └───────────────────────────────────────────────────────────┘
```

---

## 2. The Freshness Engine

Physical accessibility features deteriorate, break, or face obstruction over time. The **Freshness Engine** computes the elapsed time relative to `Date.now()` and maps features to 4 status tiers:

| Status Tier | Verification Age | Visual Indicator | Accessible Meaning |
| :--- | :--- | :--- | :--- |
| **Fresh** | `< 30 days` | Emerald Pill (`bg-emerald-100 text-emerald-950 border-emerald-400`) + Checkmark | Confirmed operational recently (High Reliability) |
| **Moderate** | `30–90 days` | Amber Pill (`bg-amber-100 text-amber-950 border-amber-400`) + Clock | Verified 1-3 months ago (Check recent notes) |
| **Stale** | `> 90 days` | Rose Pill (`bg-rose-100 text-rose-950 border-rose-400`) + Warning Alert | Needs community re-verification |
| **Unverified** | `Never / null` | Slate Dashed Pill (`bg-slate-100 text-slate-800 border-slate-300`) + Question | Not yet verified by community |

---

## 3. Repository Structure

```text
OmniWay/
├── package.json                 # Workspaces config (client, server) & concurrently runner
├── .gitignore
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.js            # App entry & graceful shutdown
│   │   ├── config/
│   │   │   └── db.js            # Mongoose connection with retry & pool logic
│   │   ├── models/
│   │   │   ├── Place.js         # Place schema with subdoc feature statuses
│   │   │   └── VerificationNote.js # Immutable audit log collection
│   │   ├── controllers/
│   │   │   ├── placeController.js
│   │   │   ├── verificationController.js
│   │   │   └── healthController.js
│   │   ├── routes/
│   │   │   ├── placeRoutes.js
│   │   │   ├── verificationRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── middleware/
│   │   │   ├── validate.js      # Zod schema validation middleware
│   │   │   ├── rateLimiter.js   # Endpoint-specific rate limiters
│   │   │   └── errorHandler.js  # RFC 7807 compliant error responses
│   │   ├── validators/
│   │   │   ├── placeValidator.js
│   │   │   ├── verificationValidator.js
│   │   │   └── schemas.js
│   │   ├── utils/
│   │   │   └── freshnessCalculator.js # Verification freshness tiers
│   │   └── seed.js              # Seed data with realistic multi-tier venues
│   └── tests/
│       └── api.test.js          # In-memory MongoDB integration tests
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css            # Focus rings, skip-to-content, high-contrast tokens
        ├── api/
        │   └── client.js        # Axios instance with RFC 7807 interceptors
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── FreshnessBadge.jsx  # Green/Amber/Rose/Slate time-elapsed badge
        │   │   ├── SkipToContent.jsx   # WCAG essential
        │   │   ├── AccessibleModal.jsx # Focus-trapped accessible dialog
        │   │   └── SkeletonCard.jsx
        │   ├── directory/
        │   │   ├── FilterBar.jsx
        │   │   ├── PlaceCard.jsx
        │   │   └── SearchInput.jsx
        │   ├── detail/
        │   │   ├── FeatureGrid.jsx     # 4 core features with status & timestamps
        │   │   ├── VerificationTimeline.jsx
        │   │   └── VerificationModal.jsx # Form to verify a single feature
        │   └── forms/
        │       └── AddPlaceForm.jsx
        ├── hooks/
        │   ├── usePlaces.js     # TanStack Query hooks with optimistic mutations
        │   └── useDebounce.js   # 300ms live search debounce
        └── pages/
            ├── DirectoryPage.jsx
            ├── PlaceDetailPage.jsx
            ├── AddPlacePage.jsx
            └── NotFoundPage.jsx
```

---

## 4. API Endpoints Contract

All error responses strictly comply with **RFC 7807 Problem Details** (`application/problem+json`).

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/places` | Search & filtered venue directory | `?search=cafe&category=restaurant&ramp=true&lift=true&freshOnly=true&page=1&limit=12` |
| `POST` | `/api/places` | Register a new venue | `{ name, category, address: { street, city, state, postalCode }, initialFeatures: { ... } }` |
| `GET` | `/api/places/:id` | Place profile & summary statistics | Returns Place document + dynamic freshness score |
| `GET` | `/api/places/:id/notes` | Audit timeline of verifications | `?page=1&limit=20&feature=ramp` |
| `POST` | `/api/places/:id/verify` | Submit verification & refresh timestamp | `{ feature, observedStatus, details, conditionRating, contributorName }` |
| `GET` | `/api/health` | Service health status | Returns `{ status: 'ok', timestamp, uptime, database }` |

---

## 5. Getting Started

### Prerequisites
- Node.js (v20+)
- npm (v9+)
- MongoDB (Local instance or MongoDB Atlas URI)

### Installation
From the repository root, install dependencies for all workspaces:
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` in the `server` directory:
```bash
cp server/.env.example server/.env
```

Default configuration:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/accessible_places
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Seeding
Populate the database with realistic venues across fresh, moderate, stale, and unverified tiers:
```bash
npm run seed
```

### Running Tests
Execute the comprehensive API test suite using an in-memory MongoDB runner:
```bash
npm run test
```

### Running the Full-Stack Application
Start both the backend Express server and Vite frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001](http://localhost:5001)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

> **Coexistence Guarantee:** Configured on dedicated ports (`5001`, `5173`) and MongoDB (`27017`) to run simultaneously with your other local projects (AI WhatsApp Sales Agent on 3001/3002/8080, DineFlow on 3000/3003/3004, and StuNet on 3010/3011) without any port, database, or container conflicts.

---

## 6. WCAG 2.1 AA / AAA Accessibility Highlights

1. **High Contrast Typography:** Strict adherence to `>= 7:1` contrast ratios for primary body text (`#0F172A` on `#FFFFFF` / `#F8FAFC`).
2. **Keyboard Navigation & Focus Trapping:** High-visibility 3px offset rings (`focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:offset-2`).
3. **Screen Reader Live Regions:** Dynamic filtering and optimistic updates announce state changes via `aria-live="polite"`.
4. **Accessible Dialogs:** Verification modals trap Tab cycling inside the dialog, close cleanly on `Escape`, and restore focus to the triggering element.
5. **Skip Navigation:** Top-level `.skip-link` enables keyboard and assistive technology users to bypass the navigation header directly to `#main-content`.

