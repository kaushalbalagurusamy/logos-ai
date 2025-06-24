# Logos AI Technology Stack

## Overview
Comprehensive technical documentation for the Logos AI platform, covering frontend, backend, development tools, and architectural decisions. The stack prioritizes modern web technologies, type safety, and developer experience.

## Context
@context {
  "type": "tech_stack",
  "dependencies": ["project-overview.md", "user-flow.md"],
  "scope": "full_stack_architecture",
  "last_updated": "2024-12-20"
}

## Frontend Technology Stack

### Core Framework
- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest features including useActionState and enhanced Suspense
- **TypeScript 5**: Strict type safety with latest language features
- **Node.js 22**: Runtime environment with ESM support

### UI Framework & Styling
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI components
- **Tailwind CSS 3.4**: Utility-first styling with custom design system
- **Tailwind Animate**: Animation utilities for enhanced UX
- **Class Variance Authority**: Type-safe component variants
- **CLSX & Tailwind-merge**: Conditional class composition

### Rich Text & Forms
- **Custom Rich Text Editor**: Debate-specific formatting capabilities
- **React Hook Form 7.54**: Form state management with validation
- **Zod 3.24**: Schema validation and type inference
- **Hookform Resolvers**: Zod integration for form validation
- **Input OTP**: One-time password input components

### Data Visualization & Charts
- **Recharts 2.15**: Composable charting library for analytics
- **Date-fns**: Modern date utility library
- **React Day Picker**: Date selection components

### Developer Experience
- **Lucide React**: Modern icon library with consistent styling
- **CMDK**: Command palette implementation
- **Next Themes**: Theme switching and dark mode support
- **Sonner**: Toast notifications with elegant animations

## Backend Architecture

### API Layer
- **Next.js App Router**: File-based API routing with type safety
- **RESTful Design**: Resource-based endpoints with HTTP semantics
- **Middleware Pipeline**: Authentication, validation, and error handling
- **Service Architecture**: Domain-driven service layer separation

### Database & Storage
- **PostgreSQL**: Primary database with ACID compliance
- **Prisma/Raw SQL**: Type-safe database queries with performance optimization
- **JSON Fields**: Flexible schema for formatting and metadata
- **Cloud Storage**: File uploads and document management
- **Redis**: Session storage and caching layer

### Authentication & Security
- **JWT Tokens**: Stateless authentication with refresh tokens
- **bcrypt**: Password hashing with salt rounds
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API endpoint protection
- **Input Validation**: SQL injection and XSS prevention

### AI Integration
- **OpenAI API**: GPT models for content generation and analysis
- **Custom Prompts**: Debate-specific AI instruction sets
- **Embedding Models**: Semantic search and content similarity
- **Rate Limiting**: AI API usage optimization

## Development Tools & Environment

### Package Management
- **pnpm 10.11**: Fast, disk space efficient package manager
- **package.json**: Dependency management with exact versions
- **Lock Files**: Deterministic dependency resolution

### Code Quality
- **ESLint**: JavaScript/TypeScript linting with custom rules
- **Prettier**: Code formatting with team standards
- **TypeScript Strict Mode**: Maximum type safety enforcement
- **Husky**: Git hooks for pre-commit validation

### Build & Deployment
- **Next.js Build**: Optimized production builds with tree shaking
- **Vercel Deployment**: Serverless deployment with edge functions
- **Environment Variables**: Configuration management
- **Asset Optimization**: Image and font optimization

## Architecture Patterns

### Frontend Patterns
- **Server Components First**: Minimize client-side JavaScript
- **Progressive Enhancement**: Core functionality without JavaScript
- **Component Composition**: Reusable UI building blocks
- **Error Boundaries**: Graceful error handling and recovery
- **Suspense Boundaries**: Loading states and async rendering

### Backend Patterns
- **Service Layer**: Business logic separation from API routes
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Service registry and initialization
- **Event-Driven Architecture**: Decoupled service communication
- **CQRS Principles**: Command and query responsibility separation

### State Management
- **Server State**: React Server Components for data fetching
- **Client State**: Minimal client-side state with React hooks
- **URL State**: Navigation and filter state in URLs
- **Form State**: React Hook Form for complex form handling
- **Cache Management**: SWR patterns for data synchronization

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Route-based and component-based splitting
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: System fonts with web font fallbacks
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Database connection management
- **Caching Strategy**: Redis caching for frequent operations
- **API Pagination**: Efficient data loading patterns
- **Background Jobs**: Asynchronous processing for heavy operations

### Monitoring & Analytics
- **Web Vitals**: Core web vitals tracking and optimization
- **Error Tracking**: Production error monitoring
- **Performance Metrics**: API response time monitoring
- **User Analytics**: Feature usage and engagement tracking

## Security Considerations

### Authentication Security
- **JWT Expiration**: Short-lived access tokens with refresh rotation
- **Password Policy**: Minimum strength requirements
- **Account Lockout**: Brute force attack prevention
- **Session Management**: Secure session handling

### Data Protection
- **Input Sanitization**: XSS and injection prevention
- **HTTPS Enforcement**: TLS encryption for all communications
- **Data Encryption**: Sensitive data encryption at rest
- **Privacy Compliance**: GDPR and CCPA compliance measures

### API Security
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin request control
- **Request Validation**: Schema-based input validation
- **Error Handling**: Secure error messages without information leaks

## Development Workflow

### Version Control
- **Git**: Distributed version control with feature branches
- **GitHub**: Repository hosting with pull request workflow
- **Branch Protection**: Required reviews and status checks
- **Semantic Commits**: Conventional commit message format

### Testing Strategy
- **Unit Testing**: Component and service layer testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: Critical user journey validation
- **Type Testing**: TypeScript compiler as first line of defense

### Deployment Pipeline
- **Continuous Integration**: Automated testing and building
- **Environment Promotion**: Dev -> Staging -> Production
- **Feature Flags**: Safe feature rollout and testing
- **Rollback Strategy**: Quick reversion capabilities

## Configuration Management

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# AI Services
OPENAI_API_KEY=...
OPENAI_ORG_ID=...

# Storage
UPLOAD_BUCKET=...
CDN_URL=...

# Monitoring
SENTRY_DSN=...
ANALYTICS_ID=...
```

### Feature Flags
- **Environment-based**: Feature enablement by environment
- **User-based**: Beta feature access control
- **A/B Testing**: Feature variation testing
- **Gradual Rollout**: Progressive feature deployment

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: Horizontally scalable service design
- **Load Balancing**: Traffic distribution across instances
- **Database Scaling**: Read replicas and sharding strategy
- **CDN Integration**: Global content delivery

### Vertical Scaling
- **Resource Monitoring**: CPU, memory, and disk usage tracking
- **Database Optimization**: Query performance and indexing
- **Memory Management**: Efficient data structures and garbage collection
- **Connection Limits**: Database and service connection pooling

## Technology Decisions & Rationale

### Next.js 15 Selection
- **Server Components**: Reduced client bundle size
- **App Router**: File-based routing with layouts
- **Edge Runtime**: Improved performance and global distribution
- **Built-in Optimization**: Image, font, and script optimization

### TypeScript Strict Mode
- **Type Safety**: Compile-time error prevention
- **Developer Experience**: Enhanced IDE support and refactoring
- **Documentation**: Types as living documentation
- **Team Collaboration**: Consistent API contracts

### Shadcn/UI Choice
- **Accessibility**: WCAG compliant components out of the box
- **Customization**: Full control over styling and behavior
- **Type Safety**: TypeScript-first component library
- **Developer Experience**: Excellent documentation and examples

### PostgreSQL Selection
- **ACID Compliance**: Data consistency and reliability
- **JSON Support**: Flexible schema for rich content
- **Performance**: Optimized for read-heavy workloads
- **Ecosystem**: Rich tooling and ORM support 