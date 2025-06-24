# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm dev        # Start development server on http://localhost:3000
pnpm build      # Create production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Package Management
This project uses pnpm (v10.11.0). Install dependencies with:
```bash
pnpm install
```

## Core Development Principles

### AI-First Codebase Standards
- **Modularity**: Files must not exceed 200 lines; break functionality into logical, reusable modules
- **Navigability**: Maintain descriptive file structure with clear naming conventions
- **Documentation**: All files must have explanation of contents at the top, all functions must have JSDoc/TSDoc comments
- **Programming Patterns**: Favor functional and declarative patterns, avoid classes, prefer composition over inheritance
- **Error Handling**: Throw errors instead of adding fallback values, no silent failures
- **Code Organization**: Use early returns for clarity, follow DRY principles

### TypeScript Standards
- **Type Safety**: Use TypeScript with strong type safety enabled
- **Interfaces**: Prefer interfaces over type aliases
- **Enums**: Avoid enums; use const maps instead
- **Naming**: Use descriptive names with auxiliary verbs (isLoading, hasError), prefix event handlers with 'handle'
- **Function Style**: Use the "function" keyword for pure functions, decorate with descriptive JSDoc blocks

## Architecture

### Service-Oriented Architecture
The codebase follows a service-oriented pattern with clear separation of concerns:

1. **Service Registry** (`lib/services/service-registry.ts`): Singleton that manages all service instances
2. **Base Service** (`lib/services/base-service.ts`): Abstract class providing common functionality like user context and logging
3. **Domain Services**: Specialized services for each domain (AI, Analytics, Auth, Evidence Cards, etc.)

### Key Architectural Decisions

- **Next.js App Router**: All pages use the new App Router pattern in `/app`
- **API Routes**: Located in `/app/api/`, organized by domain (analytics, evidence-cards, sources)
- **Mock Database**: Development uses an in-memory database (`lib/database.ts`) that persists to localStorage
- **Type Safety**: Comprehensive TypeScript interfaces in `lib/types.ts`
- **UI Components**: Uses shadcn/ui components with Radix UI primitives

### Component Structure

- **UI Components** (`/components/ui/`): Reusable shadcn/ui components
- **Feature Components** (`/components/`): Domain-specific components like `analytics-list.tsx`, `evidence-card.tsx`
- **Shell Component** (`logos-ai-shell.tsx`): Main application layout with navigation

### API Pattern

API routes follow a consistent pattern:
1. Authentication check via `authMiddleware`
2. Service method calls through ServiceRegistry
3. Standardized error handling with `handleApiError`

Example:
```typescript
const { data, error } = await authMiddleware(async (userId) => {
  const service = ServiceRegistry.getInstance().getService('analytics');
  return await service.getAnalytics(userId);
});
```

### State Management

- Form state: React Hook Form with Zod validation
- UI state: React state and context
- Data fetching: Native fetch with async/await

### Development Notes

- TypeScript path alias `@/*` maps to the project root
- Tailwind CSS with custom theme variables for consistent styling
- Dark mode support via CSS classes
- ESLint and TypeScript errors are ignored during builds (see `next.config.mjs`)

## Frontend Development Standards

### React 19 & Next.js 15 Best Practices
- **Server Components First**: Favor React Server Components (RSC) wherever possible
- **Minimize Client Components**: Use 'use client' directive sparingly
- **Error Boundaries**: Provide error boundaries for fault tolerance
- **Suspense**: Use Suspense for async operations and loading states
- **State Management**: Use useActionState (not deprecated useFormState), leverage enhanced useFormStatus, manage URL state with nuqs when appropriate

### Next.js 15 Patterns
- **Async APIs**: Always use async versions of runtime APIs (cookies, headers, draftMode)
- **Async Props**: Handle async params and searchParams in layouts/pages properly
- **File-based Routing**: Use layout.tsx for shared layouts, loading.tsx for loading states, error.tsx for error handling

## UI Component Standards

### Component Architecture
- **Component Library**: Use Shadcn UI components built on Radix UI primitives
- **Styling**: Use Tailwind CSS exclusively for styling
- **Accessibility**: Ensure ARIA compliance through Radix UI, full keyboard navigation support
- **Component Structure**: Organize components logically: exports, subcomponents, helpers, types
- **Performance**: Use React.memo for expensive components, implement loading skeletons, use Suspense boundaries

### Component Naming and Organization
- **Component Names**: PascalCase for component names (AnalyticsCard)
- **File Names**: kebab-case for file names (analytics-card.tsx)
- **Directories**: kebab-case for directories (components/auth-wizard)
- **Exports**: Use named exports for all components
- **Props**: Define prop interfaces with descriptive names (ComponentNameProps)

## Backend API Standards

### Service Layer Architecture
- **Single Responsibility**: Each service manages one domain (sources, analytics, evidence)
- **Base Service Extension**: All services extend BaseService for common functionality
- **Error Handling**: Consistent error handling with proper HTTP status codes
- **Input Validation**: Validate at service boundary using schemas

### API Route Patterns
- **Response Format**: All endpoints return consistent structure: `{ success: boolean, data?: T, error?: string }`
- **Authentication**: Use auth middleware for protected routes, JWT validation with dev mock support
- **Error Codes**: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 500 (server)
- **RESTful Design**: Follow RESTful principles for resource endpoints

## Project Organization

### Directory Structure
```
logos-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers  
│   └── (auth)/            # Route groups for organization
├── components/            # React components
│   ├── ui/               # Reusable UI components (Shadcn)
│   └── [domain]/         # Domain-specific components
├── lib/                  # Core utilities and services
│   ├── services/         # Business logic services
│   ├── middleware/       # Custom middleware
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
└── _docs/                # Project documentation
```

### File Naming Conventions
- **Components**: `ComponentName.tsx`
- **Services**: `domain-service.ts`
- **Utilities**: `utility-name.ts`
- **Types**: `types.ts` or `domain.types.ts`
- **API Routes**: `route.ts` in appropriate directory
- **Constants**: SCREAMING_SNAKE_CASE for constants

## Documentation Requirements

### Code Documentation
- **File Headers**: Every file must have explanation of contents at the top
- **Function Documentation**: All functions must have JSDoc comments detailing purpose, parameters, returns, and throws
- **Complex Types**: Include usage examples for complex interfaces and types

### Project Documentation
The `_docs/` directory contains systematic project documentation:
1. `project-overview.md` - Project purpose, scope, and goals
2. `user-flow.md` - User journey and application flow
3. `tech-stack.md` - Technologies, best practices, and conventions
4. `ui-rules.md` - Visual and interaction guidelines
5. `theme-rules.md` - Colors, typography, and styling foundations
6. `project-rules.md` - File structure and naming conventions
7. `phases/` - Iterative development planning

## Development Workflow

### Analysis Process
Before implementing any feature:
1. **Request Analysis**: Determine task type, identify languages/frameworks, note requirements
2. **Solution Planning**: Break down into logical steps, consider modularity and reusability
3. **Implementation Strategy**: Choose design patterns, consider performance, plan error handling

### Quality Standards
- **File Size**: Maximum 200 lines per file (break down if exceeded)
- **Code Review**: Ensure documentation, naming conventions, logical structure, size limits
- **Architecture Compliance**: Single responsibility services, proper component composition, database abstraction

### When Making Changes
1. Follow the existing service pattern for new features
2. Add types to `lib/types.ts`
3. Use the mock database for development
4. Maintain the component organization structure
5. Ensure all files have proper documentation
6. Follow TypeScript and naming conventions
7. Keep files under 200 lines
8. Use functional programming patterns
9. Implement proper error handling
10. Write descriptive commit messages