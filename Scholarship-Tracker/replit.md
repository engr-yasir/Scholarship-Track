# ScholarTrack - Scholarship Application Tracker

## Overview

ScholarTrack is a full-stack web application for managing and tracking scholarship applications. Users can add scholarships, track their application status, view deadlines, and analyze their applications through an analytics dashboard with charts showing status distribution and country breakdown.

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM for type-safe database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Charts**: Recharts for analytics visualizations (pie charts, bar charts)
- **Animations**: Framer Motion for page transitions and UI interactions
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for formatting and calculations

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful endpoints defined in `shared/routes.ts`
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Custom build script using esbuild for server, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - contains the scholarships table definition
- **Migrations**: Generated via `drizzle-kit push` command
- **Type Safety**: Zod schemas generated from Drizzle schema using drizzle-zod

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components including shadcn/ui
│   │   ├── hooks/        # Custom React hooks (useScholarships, useToast)
│   │   ├── pages/        # Page components (Dashboard, ScholarshipList)
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations (IStorage interface)
│   └── db.ts         # Database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod validation
└── migrations/       # Drizzle migrations output
```

### API Design
Routes are defined declaratively in `shared/routes.ts` with:
- HTTP method and path
- Input validation schema (Zod)
- Response schemas for different status codes

This allows type-safe API consumption on the frontend via custom hooks in `client/src/hooks/use-scholarships.ts`.

### Development vs Production
- **Development**: Uses Vite dev server with HMR, proxied through Express
- **Production**: Vite builds static assets to `dist/public`, served by Express

## External Dependencies

### Database
- **PostgreSQL**: Required for data persistence
- **Connection**: Via `DATABASE_URL` environment variable
- **Session Store**: connect-pg-simple for Express sessions (if authentication is added)

### Key NPM Packages
- **drizzle-orm** & **drizzle-kit**: Database ORM and migration tooling
- **@tanstack/react-query**: Server state management
- **recharts**: Data visualization charts
- **framer-motion**: Animation library
- **react-day-picker**: Date picker component
- **zod**: Schema validation
- **shadcn/ui components**: Full suite of Radix UI-based components

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)