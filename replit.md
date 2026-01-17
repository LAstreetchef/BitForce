# Digital Intelligence Marketing - Brand Ambassador Portal

## Overview

This is a full-stack web application for "Bit Force" (formerly Digital Intelligence Marketing) designed to help brand ambassadors sign up new customers for various home and digital services. The app features:

- **Lead Generation**: Customer information forms with AI-powered service suggestions (client-side keyword matching)
- **Ambassador Portal**: Dashboard, Leads, Tools, Team, Events, Resources, and Settings pages for authenticated ambassadors
- **Property Intelligence Tools**: Real-time property data from open APIs (NOAA weather, Open-Meteo, US Census, OpenStreetMap) for homeowner-focused insights
- **Public Events Page**: Accessible at `/events` for potential ambassadors to learn about and register for events
- **Ambassador Subscription Program**: Hybrid pricing model with Stripe integration
- **Referral System**: Track referrals, bonuses, and passive income earnings
- **Support Chat ("Charlie" System)**: Austere, anonymous support chat where ambassadors can message management without seeing who responds (like Charlie from Charlie's Angels)

## Ambassador Program Pricing

The ambassador program uses a hybrid pricing model:
- **Signup Fee**: $29 one-time activation fee
- **Monthly Subscription**: $19.99/month
- **Referral Bonus**: $50 instant cash bonus per qualified referral (after their first month)
- **Recurring Override**: 20% of referral's monthly subscription (~$4/month passive income per active referral)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom corporate blue theme
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth card animations
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` defines the `leads` table
- **Migrations**: Drizzle Kit for database migrations (`drizzle.config.ts`)

### Project Structure
- `/client` - React frontend application
- `/server` - Express backend server
- `/shared` - Shared types, schemas, and route definitions
- `/migrations` - Database migration files

### Key Design Patterns
- **Monorepo Structure**: Client and server share types via `/shared` directory
- **Type-Safe API**: Zod schemas define both validation and TypeScript types
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code
- **Component Architecture**: Feature components in `/client/src/components`, pages in `/client/src/pages`

### Service Suggestion Logic
The application uses client-side keyword matching (not actual AI) to suggest relevant services based on customer interests. Service data with keywords is defined in `/client/src/data/services.ts`.

### Property Intelligence Tools
Located at `/portal/tools`, this feature provides ambassadors with access to free, open APIs:
- **Weather Data**: Real-time weather, forecasts, and alerts from NOAA and Open-Meteo APIs (no API key required)
- **Neighborhood Data**: Census statistics (population, income, home values) from US Census Bureau API
- **Location Intelligence**: Geocoding and mapping via OpenStreetMap Nominatim API
- **Service Recommendations**: AI-generated suggestions based on weather conditions and property data

Backend service: `server/services/propertyData.ts`
Frontend page: `client/src/pages/portal/Tools.tsx`

### BFT Training Rewards System
Located at `/portal/resources`, ambassadors earn BFT tokens by completing training modules:
- **Lesson Rewards**: 5 BFT per completed lesson
- **Module Bonus**: 25 BFT bonus for completing an entire module
- **Idempotency**: Prevents duplicate awards on retries using unique keys (userId_lessonId)
- **Durable Ledger**: All BFT transactions recorded in `bftTransactions` table before success

Key files:
- `server/lib/bft-rewards.ts` - Core BFT award logic with idempotency guards
- `shared/data/trainingModulesConfig.ts` - Server-side module/lesson validation
- `client/src/pages/portal/Resources.tsx` - Training UI with BFT badges

API endpoint: `POST /api/training/complete-lesson` with `{lessonId, moduleId}`
Flow: Award lesson BFT → Check/award module BFT → Mark lesson complete (retry-safe)

### Payment Scheme Scenario Analysis
Located at `/payment-scheme`, this page provides stakeholder visibility into ambassador program economics:
- **Ambassador Parameters**: Initial ambassadors, referrals per ambassador, time frame (months)
- **Product Sales Parameters**: Sales per ambassador for Basic ($29/mo), Pro ($79/mo), Premium ($199/mo) tiers, plus average subscription length
- **5 KPI Summary Cards**: Total Revenue, Product Revenue, Total Payouts, Net Revenue, Margin
- **Revenue Breakdown Chart**: Shows all 4 revenue sources (Ambassador Fees, Basic, Pro, Premium)
- **Payout Breakdown Chart**: Shows referral bonuses and recurring overrides
- **Unit Economics**: Revenue per ambassador, payout per referral, product rev/ambassador, payout ratio

**BFT Buyback Impact Analysis** (uses live tokenomics from BitForceToken.replit.app):
- **Buyback Parameters**: % of monthly profit, current BFT price ($0.0055 default), circulating supply (10M default), price elasticity (1.5%)
- **5 Buyback KPI Cards**: Total Buyback spend, Monthly Buyback, Tokens Burned, Supply Reduction %, Projected Price
- **Price Projection Chart**: Line chart comparing price with vs without buyback over time
- **Supply Capping**: Automatically caps at 100% of circulating supply with warning message
- **Model Assumptions**: Documents elasticity formula and burn mechanics for stakeholder clarity

Frontend page: `client/src/pages/PaymentScheme.tsx`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently active)

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Secret for session management (required)
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing (required for ambassador subscriptions)
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for frontend checkout (required)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret for signature verification (optional, recommended for production)
- `ADMIN_USER_IDS`: Comma-separated list of Replit user IDs with admin access to support inbox (if empty, all authenticated users have admin access for development)
- `SYNC_API_KEY`: API key for cross-app sync with BitForceToken.replit.app (required for ambassador data sync)

### Cross-App Sync Endpoints (for BitForceToken integration)
These endpoints enable bidirectional sync between Ambassador Portal and BFT Token Platform:

**Outbound (Ambassador Portal → Token Platform):**
- `GET /api/metrics` - Returns ambassador count, customer count, monthly purchase volume (requires `x-api-key` header)
- `GET /api/activities` - Returns recent ambassador actions for activity feed (requires `x-api-key` header)
- `GET /api/sync/ambassadors/bft-leaderboard` - Returns ambassador BFT leaderboard with combined ledger + legacy balances (requires `x-api-key` header)
- `GET /api/ambassador/sso-token` - Generates signed SSO token for secure redirect to Token Platform (session auth)

**Inbound (Token Platform → Ambassador Portal):**
- The Ambassador Portal calls `GET https://bitforcetoken.replit.app/api/sync/wallet-balance?email=...` to fetch purchased BFT balances
- `GET /api/ambassador/wallet-balance` - Returns combined balance (earned + purchased BFT) for the logged-in ambassador

All sync endpoints require the `SYNC_API_KEY` in the `x-api-key` header for authentication. SSO uses `SSO_SECRET` for HMAC-SHA256 token signing.

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Async state management
- `react-hook-form` / `@hookform/resolvers`: Form handling with Zod integration
- `framer-motion`: Animation library
- `lucide-react`: Icon library
- Full shadcn/ui component set via Radix UI primitives

### Development Tools
- Vite dev server with HMR
- Replit-specific plugins for development banner and error overlay