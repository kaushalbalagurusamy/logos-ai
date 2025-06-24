# Logos AI Theme Rules

## Overview
Visual design system defining colors, typography, spacing, and styling foundations for the Logos AI platform. The theme emphasizes the VS Code-inspired dark aesthetic while maintaining accessibility and readability for intensive research workflows.

## Context
@context {
  "type": "theme_rules",
  "dependencies": ["project-overview.md", "ui-rules.md"],
  "scope": "design_system_foundations",
  "last_updated": "2024-12-20"
}

## Color System

### Primary Color Palette
```css
/* VS Code-Inspired Base Colors */
--background: #1e1e1e;           /* Main background */
--foreground: #cccccc;           /* Primary text */
--muted: #37373d;                /* Muted elements */
--muted-foreground: #969696;     /* Secondary text */
--border: #37373d;               /* Component borders */

/* Activity Bar Domain Colors */
--evidence-color: #569cd6;       /* Blue - Evidence domain */
--analytics-color: #4ec9b0;      /* Teal - Analytics domain */
--cases-color: #dcdcaa;          /* Yellow - Cases domain */
--speeches-color: #c586c0;       /* Purple - Speeches domain */
--flow-color: #ce9178;           /* Orange - Flow domain */
```

### Semantic Color System
```css
/* Interactive States */
--primary: #007acc;              /* Primary actions */
--primary-foreground: #ffffff;   /* Primary action text */
--secondary: #37373d;            /* Secondary actions */
--secondary-foreground: #cccccc; /* Secondary action text */

/* Feedback Colors */
--destructive: #f85149;          /* Error/delete actions */
--destructive-foreground: #ffffff;
--warning: #f9c23c;              /* Warning states */
--warning-foreground: #1e1e1e;
--success: #56d364;              /* Success states */
--success-foreground: #1e1e1e;

/* Component Colors */
--card: #252526;                 /* Card backgrounds */
--popover: #2d2d30;              /* Popover backgrounds */
--accent: #094771;               /* Accent elements */
--accent-foreground: #cccccc;    /* Accent text */
```

### Rich Text Formatting Colors
```css
/* Evidence Card Highlighting */
--highlight-blue: #e1f5fe;       /* Key evidence */
--highlight-pink: #fce4ec;       /* Counter-evidence */
--highlight-green: #e8f5e8;      /* Supporting data */
--highlight-yellow: #fff9c4;     /* Important quotes */

/* Text Emphasis */
--emphasis-color: #ffffff;       /* Bold-underline text */
--minimized-color: rgba(204, 204, 204, 0.7); /* Minimized text */
```

## Typography System

### Font Families
```css
/* Primary Interface Font */
--font-family-ui: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Rich Text Editor Fonts */
--font-family-serif: 'Times New Roman', Times, serif;
--font-family-sans: Arial, Helvetica, sans-serif;
--font-family-georgia: Georgia, 'Times New Roman', serif;

/* Code and Monospace */
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
                    Consolas, 'Courier New', monospace;
```

### Font Scale and Weights
```css
/* Font Sizes (rem units) */
--text-xs: 0.75rem;     /* 12px - Captions, metadata */
--text-sm: 0.875rem;    /* 14px - Body text, UI elements */
--text-base: 1rem;      /* 16px - Standard body text */
--text-lg: 1.125rem;    /* 18px - Subheadings */
--text-xl: 1.25rem;     /* 20px - Component titles */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Main headings */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Typography Application
```css
/* Heading Styles */
.h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--foreground);
}

.h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--foreground);
}

.h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--foreground);
}

/* Body Text Styles */
.body-text {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--foreground);
}

.body-small {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--muted-foreground);
}
```

## Spacing System

### Base Spacing Scale
```css
/* Spacing Scale (rem units) */
--space-px: 1px;
--space-0: 0;
--space-0_5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1_5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2_5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3_5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

### Layout Dimensions
```css
/* Component Dimensions */
--activity-bar-width: 48px;      /* 12px × 4 for touch targets */
--explorer-panel-width: 240px;   /* Flexible sidebar width */
--side-panel-width: 280px;       /* AI assistant panel */
--terminal-panel-height: 120px;  /* Command palette area */

/* Interactive Element Sizes */
--button-height-sm: 32px;
--button-height-default: 40px;
--button-height-lg: 48px;
--input-height: 40px;
--touch-target-min: 44px;        /* Minimum touch target */
```

## Shadow and Depth System

### Elevation Shadows
```css
/* Shadow Definitions */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-base: 0 1px 3px rgba(0, 0, 0, 0.15);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Component Elevation */
.elevation-0 { box-shadow: none; }
.elevation-1 { box-shadow: var(--shadow-sm); }
.elevation-2 { box-shadow: var(--shadow-base); }
.elevation-3 { box-shadow: var(--shadow-md); }
.elevation-4 { box-shadow: var(--shadow-lg); }
.elevation-5 { box-shadow: var(--shadow-xl); }
```

### Border Radius System
```css
/* Border Radius Scale */
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-base: 0.25rem;   /* 4px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-full: 9999px;    /* Circular */
```

## Component Theme Tokens

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--primary);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
}

.btn-primary:hover {
  background-color: #005a9e;  /* Darker primary */
  border-color: #005a9e;
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.btn-secondary:hover {
  background-color: #404042;  /* Lighter secondary */
}

/* Destructive Button */
.btn-destructive {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
  border: 1px solid var(--destructive);
  border-radius: var(--radius-md);
}

.btn-destructive:hover {
  background-color: #da3633;  /* Darker destructive */
}
```

### Card Components
```css
.card {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  color: var(--foreground);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transition: box-shadow 150ms ease;
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border);
}

.card-content {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--border);
  background-color: rgba(55, 55, 61, 0.3);
}
```

### Input Components
```css
.input {
  height: var(--input-height);
  padding: var(--space-2) var(--space-3);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font-size: var(--text-sm);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}

.input::placeholder {
  color: var(--muted-foreground);
}
```

## Animation and Transitions

### Transition Timing
```css
/* Transition Durations */
--transition-fast: 75ms;
--transition-normal: 150ms;
--transition-slow: 300ms;

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Common Transitions */
.transition-colors {
  transition: color var(--transition-normal) var(--ease-out),
              background-color var(--transition-normal) var(--ease-out),
              border-color var(--transition-normal) var(--ease-out);
}

.transition-shadow {
  transition: box-shadow var(--transition-normal) var(--ease-out);
}

.transition-transform {
  transition: transform var(--transition-normal) var(--ease-out);
}
```

### Hover and Focus States
```css
/* Interactive States */
.interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.focusable:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Activity Bar Icons */
.activity-icon {
  color: var(--muted-foreground);
  transition: color var(--transition-normal) var(--ease-out);
}

.activity-icon:hover,
.activity-icon.active {
  color: var(--foreground);
}

.activity-icon.active {
  border-left: 2px solid var(--primary);
}
```

## Domain-Specific Theming

### Evidence Domain Theme
```css
.evidence-theme {
  --accent-color: var(--evidence-color);
  --accent-bg: rgba(86, 156, 214, 0.1);
  --accent-border: rgba(86, 156, 214, 0.3);
}
```

### Analytics Domain Theme
```css
.analytics-theme {
  --accent-color: var(--analytics-color);
  --accent-bg: rgba(78, 201, 176, 0.1);
  --accent-border: rgba(78, 201, 176, 0.3);
}
```

### Cases Domain Theme
```css
.cases-theme {
  --accent-color: var(--cases-color);
  --accent-bg: rgba(220, 220, 170, 0.1);
  --accent-border: rgba(220, 220, 170, 0.3);
}
```

### Speeches Domain Theme
```css
.speeches-theme {
  --accent-color: var(--speeches-color);
  --accent-bg: rgba(197, 134, 192, 0.1);
  --accent-border: rgba(197, 134, 192, 0.3);
}
```

### Flow Domain Theme
```css
.flow-theme {
  --accent-color: var(--flow-color);
  --accent-bg: rgba(206, 145, 120, 0.1);
  --accent-border: rgba(206, 145, 120, 0.3);
}
```

## Rich Text Editor Theme

### Editor Colors
```css
.rich-text-editor {
  background-color: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

/* Toolbar Styling */
.editor-toolbar {
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
  padding: var(--space-2);
}

.toolbar-button {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.toolbar-button:hover,
.toolbar-button.active {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
```

### Text Formatting Styles
```css
/* Emphasis Formatting */
.text-emphasis {
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
  color: var(--emphasis-color);
}

/* Highlight Colors */
.highlight-blue { background-color: var(--highlight-blue); }
.highlight-pink { background-color: var(--highlight-pink); }
.highlight-green { background-color: var(--highlight-green); }
.highlight-yellow { background-color: var(--highlight-yellow); }

/* Minimized Text */
.text-minimized {
  font-size: var(--text-xs);
  color: var(--minimized-color);
  opacity: 0.7;
}
```

## Dark Mode Implementation

### CSS Custom Properties Strategy
```css
:root {
  /* Light mode colors (fallback) */
  --background: #ffffff;
  --foreground: #000000;
}

[data-theme="dark"] {
  /* Dark mode colors (primary) */
  --background: #1e1e1e;
  --foreground: #cccccc;
  /* All other dark theme variables... */
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1e1e1e;
    --foreground: #cccccc;
    /* Dark theme as default */
  }
}
```

### Theme Toggle Implementation
```typescript
// Theme switching utility
export const toggleTheme = () => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

## Accessibility Considerations

### Color Contrast Ratios
- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **UI Components**: 3:1 minimum contrast ratio
- **Focus Indicators**: High contrast with 2px outline

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --border: #ffffff;
    --foreground: #ffffff;
    --background: #000000;
    --shadow-base: 0 0 0 1px #ffffff;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
``` 