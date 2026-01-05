# Digital Intelligence Marketing - Brand Ambassador Portal

## Overview

This is a single-page web application for "Digital Intelligence Marketing" designed to help brand ambassadors sign up new customers for various home and digital services. The app features a customer information form, AI-powered service suggestions (using client-side keyword matching), a grid of available services with detailed modals, and a premium membership section.

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

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently active)

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)

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