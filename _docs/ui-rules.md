# Logos AI UI Rules & Guidelines

## Overview
Visual and interaction design principles for the Logos AI platform, establishing consistent user experience patterns across all components and features. The design emphasizes the VS Code-inspired aesthetic while optimizing for debate research workflows.

## Context
@context {
  "type": "ui_rules",
  "dependencies": ["project-overview.md", "user-flow.md", "tech-stack.md"],
  "scope": "design_system_guidelines",
  "last_updated": "2024-12-20"
}

## Design Philosophy

### VS Code-Inspired Interface
- **Dark Theme Primary**: Professional development environment aesthetic
- **Hierarchical Navigation**: Clear information architecture with nested structures
- **Activity-Based Organization**: Domain-focused workflow separation
- **Command-Driven Interaction**: Keyboard shortcuts and command palette
- **Contextual Tools**: Relevant features surface based on current task

### Debate-Specific UX Principles
- **Evidence-First Design**: Quick access to source material and citations
- **Tournament Preparation**: Interface optimized for time-pressured environments
- **Collaborative Workflows**: Multi-user editing and sharing capabilities
- **Rich Text Emphasis**: Advanced formatting for debate-specific content
- **Search-Driven Discovery**: Fast content location and cross-referencing

## Layout Architecture

### Main Interface Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [Activity Bar] [Explorer Panel] [Editor Panel] [Side Panel] │
│      12px           240px         flexible       280px      │
│                                                             │
│                        [Terminal Panel]                     │
│                            120px                            │
└─────────────────────────────────────────────────────────────┘
```

### Activity Bar (12px width)
- **Purpose**: Primary navigation between application domains
- **Design**: Vertical icon stack with color-coded categories
- **Behavior**: Single-click domain switching with visual state
- **Icons**: Lucide React icons with consistent 20px sizing

### Explorer Panel (240px width)
- **Purpose**: File/folder tree navigation for current domain
- **Design**: Hierarchical tree with expand/collapse functionality
- **Behavior**: Context menus and drag-and-drop support
- **Content**: Domain-specific organizational structures

### Editor Panel (Flexible width)
- **Purpose**: Primary content editing and viewing area
- **Design**: Tabbed interface with multiple document support
- **Behavior**: Rich text editing with debate-specific formatting
- **Layout**: Responsive sizing based on content requirements

### Side Panel (280px width)
- **Purpose**: Supplementary tools and AI assistance
- **Design**: Collapsible panel with contextual content
- **Behavior**: Dynamic content based on current activity
- **Features**: AI chat, source previews, analytics tools

### Terminal Panel (120px height)
- **Purpose**: Command palette and quick actions
- **Design**: Minimalist command interface
- **Behavior**: Keyboard-driven command execution
- **Content**: Search, navigation, and system commands

## Component Design Standards

### Typography System
```css
/* Heading Scale */
h1: 2.25rem (36px) - Page titles
h2: 1.875rem (30px) - Section headers
h3: 1.5rem (24px) - Subsection headers
h4: 1.25rem (20px) - Component titles
h5: 1.125rem (18px) - Field labels
h6: 1rem (16px) - Small headings

/* Body Text */
body: 0.875rem (14px) - Primary text
small: 0.75rem (12px) - Secondary text
caption: 0.6875rem (11px) - Metadata text

/* Code/Monospace */
code: 0.8125rem (13px) - Inline code
pre: 0.75rem (12px) - Code blocks
```

### Button Hierarchy
```typescript
// Primary Actions
<Button variant="default" size="default">
  Save Analytics
</Button>

// Secondary Actions
<Button variant="outline" size="default">
  Cancel
</Button>

// Destructive Actions
<Button variant="destructive" size="default">
  Delete Source
</Button>

// Icon-Only Actions
<Button variant="ghost" size="icon">
  <Search className="h-4 w-4" />
</Button>
```

### Input Component Standards
- **Text Inputs**: Consistent height (40px) with clear focus states
- **Rich Text Editors**: Debate-specific toolbar with formatting options
- **Select Dropdowns**: Searchable with clear option hierarchy
- **File Uploads**: Drag-and-drop with progress indicators
- **Search Fields**: Global search with auto-complete suggestions

## Rich Text Formatting Rules

### Evidence Card Formatting
```typescript
interface EvidenceFormattingRules {
  emphasis: {
    style: "bold-underline"
    font: "Georgia" | "Times New Roman" | "Arial"
    color: "#ffffff" // High contrast for readability
  }
  
  highlights: {
    "pastel-blue": "#e1f5fe"    // Key evidence
    "pastel-pink": "#fce4ec"    // Counter-evidence  
    "pastel-green": "#e8f5e8"   // Supporting data
    "pastel-yellow": "#fff9c4"  // Important quotes
  }
  
  minimized: {
    fontSize: "0.75rem" // 12px for less important text
    opacity: 0.7
  }
}
```

### Analytics Text Formatting
- **Standard Fonts**: Times New Roman, Arial, Georgia
- **Size Range**: 10px - 16px with consistent scaling
- **Line Height**: 1.5x for optimal readability
- **Paragraph Spacing**: 1em between paragraphs
- **List Formatting**: Consistent bullet and numbering styles

## Interactive Component Patterns

### Navigation Behaviors
```typescript
// Breadcrumb Navigation
<Breadcrumb>
  <BreadcrumbItem>Analytics</BreadcrumbItem>
  <BreadcrumbItem>Tournament Prep</BreadcrumbItem>
  <BreadcrumbItem>Affirmative Case</BreadcrumbItem>
</Breadcrumb>

// Tab Navigation
<Tabs value="evidence" className="w-full">
  <TabsList>
    <TabsTrigger value="evidence">Evidence</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
</Tabs>
```

### Modal and Dialog Patterns
- **Confirmation Dialogs**: Destructive actions require explicit confirmation
- **Form Modals**: Complex forms open in modal overlays
- **Context Menus**: Right-click actions for quick operations
- **Command Palette**: Cmd/Ctrl+K for global command access

### Loading and Feedback States
```typescript
// Loading Skeletons
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-20 w-full" />
  </CardContent>
</Card>

// Toast Notifications
toast.success("Analytics saved successfully")
toast.error("Failed to delete source")
toast.loading("Processing document...")
```

## Responsive Design Guidelines

### Breakpoint System
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Large tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Large laptops */
2xl: 1536px /* Desktops */
```

### Mobile Adaptations
- **Activity Bar**: Transforms to bottom navigation on mobile
- **Panels**: Stack vertically with collapsible sections
- **Editor**: Full-width with simplified toolbar
- **Touch Targets**: Minimum 44px for touch interactions

### Tablet Considerations
- **Panel Widths**: Adjusted ratios for landscape orientation
- **Touch Interactions**: Enhanced gesture support
- **Keyboard Support**: External keyboard shortcuts maintained

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators and logical tab order

### Semantic HTML Usage
```jsx
// Proper heading hierarchy
<section>
  <h2>Evidence Management</h2>
  <article>
    <h3>Source: Climate Change Report</h3>
    <h4>Evidence Card: Temperature Projections</h4>
  </article>
</section>

// Form accessibility
<form>
  <label htmlFor="analytics-title">Analytics Title</label>
  <input 
    id="analytics-title" 
    aria-describedby="title-help"
    required
  />
  <p id="title-help">Enter a descriptive title for your analytics</p>
</form>
```

## Animation and Interaction Guidelines

### Micro-Interactions
- **Hover States**: Subtle color and shadow changes (150ms transition)
- **Click Feedback**: Brief visual confirmation of actions
- **Loading States**: Skeleton screens and progress indicators
- **State Changes**: Smooth transitions between interface states

### Animation Timing
```css
/* Standard Transitions */
.transition-standard {
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth Transitions */
.transition-smooth {
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fast Transitions */
.transition-fast {
  transition-duration: 75ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Error Handling and Feedback

### Error State Designs
```jsx
// Form Field Errors
<div className="space-y-2">
  <label htmlFor="source-url">Source URL</label>
  <input 
    id="source-url"
    className={cn(
      "border-input",
      error && "border-destructive focus:border-destructive"
    )}
  />
  {error && (
    <p className="text-sm text-destructive flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {error.message}
    </p>
  )}
</div>

// Empty States
<div className="text-center py-12">
  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
  <h3 className="mt-4 text-lg font-semibold">No evidence cards found</h3>
  <p className="text-muted-foreground">
    Start by uploading a source document
  </p>
  <Button className="mt-4">
    <Plus className="h-4 w-4 mr-2" />
    Add Source
  </Button>
</div>
```

### Success and Confirmation Patterns
- **Save Confirmations**: Auto-save indicators with timestamp
- **Bulk Actions**: Progress bars for multi-item operations
- **Undo Actions**: Brief opportunity to reverse destructive actions
- **Success Messages**: Clear confirmation of completed actions

## Performance and Optimization

### Image and Asset Guidelines
- **Icons**: SVG icons from Lucide React (20px, 24px standard sizes)
- **Logos**: Optimized SVG or WebP formats
- **User Uploads**: Progressive loading with optimized formats
- **Placeholder Images**: Consistent aspect ratios and styling

### Component Performance
- **Lazy Loading**: Components load as needed
- **Virtual Scrolling**: Large lists use virtualization
- **Memoization**: Expensive components use React.memo
- **Bundle Splitting**: Route-based code splitting

## Design Token System

### Spacing Scale
```css
/* Tailwind Spacing (rem) */
0.5: 0.125rem (2px)   /* Minimal spacing */
1: 0.25rem (4px)      /* Small spacing */
2: 0.5rem (8px)       /* Medium spacing */
3: 0.75rem (12px)     /* Standard spacing */
4: 1rem (16px)        /* Large spacing */
6: 1.5rem (24px)      /* Section spacing */
8: 2rem (32px)        /* Component spacing */
12: 3rem (48px)       /* Layout spacing */
```

### Shadow System
```css
/* Component Shadows */
.shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
.shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
.shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
.shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
.shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)
```

## Component Library Standards

### Card Component Usage
```jsx
// Standard Card Pattern
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Analytics: Affirmative Framework</CardTitle>
    <CardDescription>
      Last updated 2 hours ago
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Analytics content preview...</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Edit</Button>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### List Component Patterns
- **Evidence Lists**: Card-based layout with metadata
- **Source Lists**: Hierarchical tree with expand/collapse
- **Analytics Lists**: Grid layout with preview content
- **Search Results**: Unified format across all content types 