# Logos AI Project Rules

## Overview
File structure, naming conventions, and organizational guidelines for the Logos AI platform. These rules ensure consistency, maintainability, and optimal development experience across the entire codebase.

## Context
@context {
  "type": "project_rules",
  "dependencies": ["project-overview.md", "tech-stack.md"],
  "scope": "codebase_organization",
  "last_updated": "2024-12-20"
}

## File Structure Guidelines

### Root Directory Organization
```
logos-ai/
├── _docs/                    # Project documentation
│   ├── phases/              # Development phase planning
│   ├── project-overview.md
│   ├── user-flow.md
│   ├── tech-stack.md
│   ├── ui-rules.md
│   ├── theme-rules.md
│   └── project-rules.md
├── app/                     # Next.js App Router
│   ├── api/                # API route handlers
│   ├── (auth)/             # Route groups for organization
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── analytics/          # Analytics domain components
│   ├── evidence/           # Evidence domain components
│   ├── sources/            # Source management components
│   └── shared/             # Reusable business components
├── lib/                    # Core utilities and services
│   ├── services/           # Business logic services
│   ├── middleware/         # Custom middleware
│   ├── database.ts         # Database utilities
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
├── styles/                 # Additional stylesheets
└── [config files]          # Configuration files
```

### Next.js App Router Structure
```
app/
├── api/                    # API Routes
│   ├── analytics/
│   │   ├── [analyticsId]/
│   │   │   ├── duplicate/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── documents/
│   │   ├── [documentId]/
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── evidence-cards/
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── route.ts
│   └── sources/
│       ├── [sourceId]/
│       │   └── route.ts
│       └── route.ts
├── (auth)/                 # Authentication route group
├── (dashboard)/            # Dashboard route group
├── globals.css
├── layout.tsx
└── page.tsx
```

## Naming Conventions

### File Naming Standards
```typescript
// React Components (PascalCase)
AnalyticsCard.tsx
SourceManager.tsx
EvidenceEditor.tsx

// Utility Files (kebab-case)
api-utils.ts
database-utils.ts
auth-middleware.ts

// Service Files (kebab-case with suffix)
analytics-service.ts
source-service.ts
evidence-card-service.ts

// Hook Files (camelCase with prefix)
useAnalytics.ts
useSourceManager.ts
useEvidenceCard.ts

// Type Definition Files (kebab-case)
types.ts
analytics.types.ts
evidence.types.ts

// API Route Files (always route.ts)
route.ts  // For all API endpoints
```

### Directory Naming Patterns
```
// Component Directories (kebab-case)
components/
├── analytics-editor/
├── source-manager/
├── evidence-cards/
└── ui/

// Service Directories (kebab-case)
lib/
├── services/
├── middleware/
└── database/

// Domain-Specific Organization
analytics/
├── analytics-list.tsx
├── analytics-editor.tsx
├── analytics-folder-tree.tsx
└── analytics-test-data.tsx
```

### Variable and Function Naming
```typescript
// Interface Names (PascalCase)
interface AnalyticsData {
  id: string;
  title: string;
}

// Type Names (PascalCase)
type UserRole = "student" | "coach" | "admin";

// Function Names (camelCase with descriptive verbs)
function createAnalytics(data: AnalyticsData): Analytics { }
function handleAnalyticsSubmit(event: FormEvent): void { }
function validateSourceUpload(file: File): boolean { }

// Variable Names (camelCase with descriptive nouns)
const analyticsData = await fetchAnalytics();
const selectedSourceId = useState<string | null>(null);
const isEditingAnalytics = useState<boolean>(false);

// Boolean Variables (is/has prefix)
const isLoading = false;
const hasError = true;
const canEdit = user.role === "admin";

// Event Handlers (handle prefix)
const handleSave = () => { };
const handleCancel = () => { };
const handleDelete = (id: string) => { };

// Constants (SCREAMING_SNAKE_CASE)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_CITATION_STYLE = "MLA";
const API_ENDPOINTS = {
  ANALYTICS: "/api/analytics",
  SOURCES: "/api/sources"
};
```

## Component Organization Standards

### Component File Structure
```typescript
/**
 * Analytics Editor Component
 * Provides rich text editing interface for analytics entries
 */

// Imports (grouped and sorted)
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsService } from "@/lib/services/analytics-service"
import type { Analytics, AnalyticsFormData } from "@/lib/types"

// Interfaces and Types (before component)
interface AnalyticsEditorProps {
  analyticsId?: string;
  onSave: (data: Analytics) => void;
  onCancel: () => void;
}

// Component Implementation
export function AnalyticsEditor({ analyticsId, onSave, onCancel }: AnalyticsEditorProps) {
  // State declarations
  const [formData, setFormData] = useState<AnalyticsFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect hooks
  useEffect(() => {
    // Component initialization logic
  }, [analyticsId]);

  // Event handlers
  const handleSubmit = async (event: FormEvent) => {
    // Form submission logic
  };

  const handleCancel = () => {
    // Cancel logic
  };

  // Helper functions
  const validateFormData = (data: AnalyticsFormData): boolean => {
    // Validation logic
  };

  // Render
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
}

// Sub-components (if needed)
function AnalyticsFormFields({ data, onChange }: AnalyticsFormFieldsProps) {
  // Sub-component implementation
}

// Default export (if required)
export default AnalyticsEditor;
```

### Component Directory Structure
```
components/
├── analytics/
│   ├── analytics-editor.tsx       # Main editor component
│   ├── analytics-list.tsx         # List view component
│   ├── analytics-folder-tree.tsx  # Folder organization
│   ├── analytics-link-manager.tsx # Link management
│   └── analytics-test-data.tsx    # Test data (temporary)
├── sources/
│   ├── source-manager.tsx         # Source management
│   ├── source-upload.tsx          # File upload
│   └── source-citation.tsx        # Citation formatting
└── ui/                            # Shadcn UI components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

## Service Layer Organization

### Service File Structure
```typescript
/**
 * Analytics Service
 * Manages CRUD operations for analytics entries and organizational folders
 */

import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { Analytics, AnalyticsFolder, CreateAnalyticsInput } from "@/lib/types"
import { BaseService } from "./base-service"

export class AnalyticsService extends BaseService {
  /**
   * Retrieves analytics entries for a user
   * @param userId - User ID to filter analytics
   * @param filters - Optional filters for the query
   * @returns Promise resolving to analytics array
   */
  async getAnalytics(
    userId: string,
    filters: AnalyticsFilters = {}
  ): Promise<Analytics[]> {
    // Implementation
  }

  /**
   * Creates a new analytics entry
   * @param analyticsData - Data for the new analytics entry
   * @returns Promise resolving to created analytics
   */
  async createAnalytics(
    analyticsData: CreateAnalyticsInput
  ): Promise<Analytics> {
    // Implementation
  }

  // Private helper methods
  private mapRowToAnalytics(row: any): Analytics {
    // Mapping logic
  }

  private validateAnalyticsData(data: CreateAnalyticsInput): void {
    // Validation logic
  }
}

// Service instance export
export const analyticsService = new AnalyticsService();
```

### Service Directory Organization
```
lib/services/
├── base-service.ts           # Base service class
├── analytics-service.ts      # Analytics domain service
├── source-service.ts         # Source management service
├── evidence-card-service.ts  # Evidence card service
├── auth-service.ts          # Authentication service
├── ai-service.ts            # AI integration service
└── service-registry.ts      # Service initialization
```

## API Route Organization

### API Route Structure
```typescript
/**
 * Analytics API Route Handler
 * Handles CRUD operations for analytics entries
 */

import { NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/services/analytics-service"
import { authenticateRequest } from "@/lib/middleware/auth-middleware"
import { createApiResponse, handleApiError } from "@/lib/api-utils"

/**
 * GET /api/analytics
 * Retrieves analytics entries for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const analytics = await analyticsService.getAnalytics(user.id);
    return createApiResponse(analytics);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/analytics
 * Creates a new analytics entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const data = await request.json();
    const analytics = await analyticsService.createAnalytics(data, user.id);
    return createApiResponse(analytics, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### API Route Directory Structure
```
app/api/
├── analytics/
│   ├── [analyticsId]/
│   │   ├── duplicate/
│   │   │   └── route.ts      # POST /api/analytics/[id]/duplicate
│   │   └── route.ts          # GET, PUT, DELETE /api/analytics/[id]
│   └── route.ts              # GET, POST /api/analytics
├── sources/
│   ├── [sourceId]/
│   │   └── route.ts          # GET, PUT, DELETE /api/sources/[id]
│   └── route.ts              # GET, POST /api/sources
└── evidence-cards/
    ├── search/
    │   └── route.ts          # POST /api/evidence-cards/search
    └── route.ts              # GET, POST /api/evidence-cards
```

## Type Definition Organization

### Types File Structure
```typescript
/**
 * Core Type Definitions
 * Shared types used across the application
 */

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "coach" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Domain-Specific Types
export interface Analytics {
  id: string;
  title: string;
  content: string;
  // ... other properties
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Data Types
export interface CreateAnalyticsInput {
  title: string;
  content: string;
  // ... other required fields
}
```

### Type File Organization
```
lib/
├── types.ts                  # Core shared types
├── analytics.types.ts        # Analytics domain types
├── evidence.types.ts         # Evidence domain types
├── sources.types.ts          # Source management types
└── api.types.ts             # API request/response types
```

## Import and Export Conventions

### Import Organization
```typescript
// External library imports (first)
import { useState, useEffect } from "react"
import { NextRequest, NextResponse } from "next/server"

// UI component imports (second)
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Internal component imports (third)
import { AnalyticsEditor } from "@/components/analytics/analytics-editor"
import { SourceManager } from "@/components/sources/source-manager"

// Service and utility imports (fourth)
import { analyticsService } from "@/lib/services/analytics-service"
import { cn } from "@/lib/utils"

// Type imports (last, with type prefix)
import type { Analytics, User } from "@/lib/types"
import type { ComponentProps } from "react"
```

### Export Conventions
```typescript
// Named exports (preferred for components)
export function AnalyticsCard({ analytics }: AnalyticsCardProps) {
  // Component implementation
}

// Named exports with interface
export interface AnalyticsCardProps {
  analytics: Analytics;
  onEdit?: () => void;
}

// Default exports (only when required)
export default AnalyticsCard;

// Service exports
export const analyticsService = new AnalyticsService();
export { AnalyticsService };

// Type exports
export type { Analytics, AnalyticsFolder };
export interface CreateAnalyticsInput {
  // Interface definition
}
```

## File Size and Code Organization

### File Size Limits
- **Maximum 200 lines per file** (enforced by user rules)
- Split larger files into multiple focused modules
- Extract complex components into separate files
- Move utility functions to dedicated files

### Code Splitting Strategies
```typescript
// Before: Large analytics editor (250+ lines)
// analytics-editor.tsx

// After: Split into focused modules
// analytics-editor.tsx (main component)
// analytics-form-fields.tsx (form components)
// analytics-toolbar.tsx (toolbar component)
// analytics-utils.ts (utility functions)
// analytics.types.ts (type definitions)
```

## Documentation Standards

### File Header Requirements
```typescript
/**
 * Analytics Editor Component
 * 
 * Provides rich text editing interface for analytics entries with support for:
 * - Rich text formatting (bold, underline, highlighting)
 * - Source linking and citation management
 * - Auto-save functionality
 * - Collaborative editing features
 * 
 * @author Development Team
 * @version 1.0.0
 * @since 2024-12-20
 */
```

### Function Documentation
```typescript
/**
 * Creates a new analytics entry with validation
 * 
 * @param analyticsData - Analytics entry data to create
 * @param userId - ID of the user creating the entry
 * @returns Promise resolving to the created analytics entry
 * @throws {ValidationError} When analytics data is invalid
 * @throws {AuthorizationError} When user lacks permissions
 * 
 * @example
 * const analytics = await createAnalytics({
 *   title: "Climate Change Analysis",
 *   content: "Detailed analysis content...",
 *   tags: ["climate", "environment"]
 * }, user.id);
 */
async function createAnalytics(
  analyticsData: CreateAnalyticsInput,
  userId: string
): Promise<Analytics> {
  // Implementation
}
```

## Testing and Quality Standards

### Test File Organization
```
__tests__/
├── components/
│   ├── analytics/
│   │   ├── analytics-editor.test.tsx
│   │   └── analytics-list.test.tsx
│   └── ui/
│       └── button.test.tsx
├── services/
│   ├── analytics-service.test.ts
│   └── source-service.test.ts
└── utils/
    └── api-utils.test.ts
```

### Quality Assurance
- **TypeScript Strict Mode**: All files must pass strict type checking
- **ESLint Compliance**: No linting errors allowed
- **Prettier Formatting**: Consistent code formatting
- **Documentation Coverage**: All public functions documented
- **Test Coverage**: Critical paths covered by tests

## Environment and Configuration

### Configuration File Organization
```
├── .env.local              # Local environment variables
├── .env.example            # Environment variable template
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── components.json        # Shadcn UI configuration
├── package.json          # Package dependencies
└── pnpm-lock.yaml        # Lock file
```

### Environment Variable Naming
```env
# Database Configuration
DATABASE_URL=postgresql://...
DATABASE_MAX_CONNECTIONS=10

# Authentication
JWT_SECRET=...
JWT_EXPIRES_IN=24h

# AI Services
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4

# Feature Flags
FEATURE_AI_ASSISTANCE=true
FEATURE_COLLABORATION=false
``` 