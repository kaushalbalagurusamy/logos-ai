# Logos AI User Flow

## Overview
This document outlines the complete user journey through the Logos AI platform, from initial onboarding to advanced tournament preparation. The flow emphasizes the VS Code-inspired interface design and the five core domains of the application.

## Context
@context {
  "type": "user_flow",
  "dependencies": ["project-overview.md"],
  "scope": "complete_user_journey",
  "last_updated": "2024-12-20"
}

## Primary User Personas

### Competitive Debater (Primary)
- **Goals**: Efficient research, organized evidence, strong analytics, winning cases
- **Context**: Tournament preparation, time constraints, collaboration needs
- **Technical Level**: Moderate to high, familiar with research tools

### Debate Coach (Secondary)
- **Goals**: Team management, teaching resources, performance tracking
- **Context**: Managing multiple students, curriculum development
- **Technical Level**: Variable, focus on educational features

## Core User Journey

### 1. Authentication & Onboarding
**Entry Point**: Landing page or direct app access

1. **Account Creation/Login**
   - Email/password authentication
   - School/organization affiliation
   - Role selection (student, coach, admin)
   - Initial preferences setup (citation style, debate format)

2. **First-Time Setup**
   - Workspace tour highlighting VS Code-inspired interface
   - Sample data demonstration (evidence cards, analytics)
   - Tutorial for core workflows
   - Integration setup (cloud storage, tournament platforms)

### 2. Main Application Interface
**VS Code-Inspired Layout**

#### Activity Bar (Left Sidebar)
Primary navigation with color-coded categories:
- **Evidence** (Blue): Source and evidence card management
- **Analytics** (Teal): Research analysis and note-taking  
- **Cases** (Yellow): Argument construction and templates
- **Speeches** (Purple): Presentation preparation
- **Flow** (Orange): Tournament round management

#### Panel Layout
- **Explorer Panel**: File/folder tree for current domain
- **Editor Panel**: Main content editing area
- **Sidebar Panel**: Supplementary tools and AI assistance
- **Terminal Panel**: Command palette and quick actions

### 3. Evidence Management Workflow

#### Source Management
1. **Source Upload**
   - Drag-and-drop PDF/document upload
   - URL import for online sources
   - Automatic metadata extraction (title, author, date)
   - Citation style selection and validation

2. **Source Organization**
   - Folder-based organization by topic/tournament
   - Tagging system for quick filtering
   - Search functionality across all sources
   - Duplicate detection and merging

#### Evidence Card Creation
1. **Card Extraction**
   - Text selection from source documents
   - AI-suggested evidence boundaries
   - Automatic tag line generation
   - Shorthand creation for quick reference

2. **Card Formatting**
   - Rich text editor with debate-specific formatting
   - Emphasis (bold-underline) for key arguments
   - Color highlighting (blue, pink, green, yellow)
   - Text minimization for tournament prep
   - Version history and change tracking

3. **Card Management**
   - Folder organization within sources
   - Cross-referencing between related cards
   - Quality ratings and coach feedback
   - Export options for tournament use

### 4. Analytics Development Workflow

#### Analytics Creation
1. **New Analytics Entry**
   - Title and summary creation
   - Rich text content editor
   - Source/evidence card linking
   - Tag assignment and categorization

2. **Content Development**
   - AI writing assistance and suggestions
   - Citation integration from linked sources
   - Argument structure templates
   - Collaborative editing features

#### Analytics Organization
1. **Folder Structure**
   - Nested folder hierarchies
   - Topic-based organization
   - Tournament-specific groupings
   - Shared team folders

2. **Linking System** 
   - **Paraphrase Links**: Direct evidence interpretation
   - **Comparison Links**: Multiple source analysis
   - **Extension Links**: Building on existing arguments
   - **Response Links**: Counter-argument development

### 5. Case Building Workflow

#### Case Structure
1. **Template Selection**
   - Policy debate templates (1AC, 1NC, 2AC, etc.)
   - Lincoln-Douglas templates
   - Public Forum templates
   - Custom case structures

2. **Content Assembly**
   - Evidence card insertion via drag-and-drop
   - Analytics integration for argument development
   - Transition writing and flow management
   - Time allocation and speech planning

#### Case Management
1. **Version Control**
   - Draft saving and version history
   - Change tracking for collaborative editing
   - Rollback capabilities
   - Performance comparison across versions

2. **Collaboration Features**
   - Real-time collaborative editing
   - Comment and suggestion system
   - Role-based permissions (viewer, editor, admin)
   - Team case libraries

### 6. Speech Preparation Workflow

#### Speech Development
1. **Speech Planning**
   - Time allocation by argument block
   - Evidence selection and prioritization
   - Transition scripting
   - Rebuttal preparation

2. **Practice Tools**
   - Speech timer with argument tracking
   - Recording capabilities for self-review
   - AI feedback on pacing and clarity
   - Tournament simulation mode

#### Flow Management
1. **Round Preparation**
   - Opponent research and case prediction
   - Evidence pre-flow and organization
   - Strategy planning and argument selection
   - Contingency preparation

2. **Round Execution**
   - Real-time flow tracking
   - Evidence marking and cross-application
   - Judge preference adaptation
   - Post-round analysis and notes

### 7. AI Assistant Integration

#### Research Assistance
1. **Source Discovery**
   - AI-powered source recommendations
   - Research gap identification
   - Citation validation and formatting
   - Quality assessment of sources

2. **Content Generation**
   - Analytics writing assistance
   - Argument development suggestions
   - Citation integration and formatting
   - Logical consistency checking

#### Strategic Analysis
1. **Argument Evaluation**
   - Strength assessment of case positions
   - Vulnerability analysis and responses
   - Link chain evaluation
   - Impact calculus assistance

2. **Performance Insights**
   - Win/loss pattern analysis
   - Argument success rate tracking
   - Judge preference adaptation
   - Improvement recommendations

## User Interface Patterns

### Navigation Consistency
- **Breadcrumb Navigation**: Clear path indication within domains
- **Quick Actions**: Keyboard shortcuts for common operations
- **Search Integration**: Global search across all content types
- **Command Palette**: VS Code-style command execution

### Content Management
- **Auto-Save**: Continuous saving of work progress
- **Offline Capability**: Local editing with sync on reconnection
- **Export Options**: Multiple format support for tournament use
- **Backup Systems**: Automatic backup and recovery

### Collaboration Features
- **Real-Time Sync**: Live editing and update notifications
- **Communication Tools**: In-app messaging and comments
- **Permission Management**: Granular access control
- **Team Workspaces**: Shared environments for debate teams

## Error Handling & Edge Cases

### Technical Issues
- **Connection Loss**: Offline mode with sync recovery
- **Large File Handling**: Progressive loading and optimization
- **Browser Compatibility**: Graceful degradation for older browsers
- **Performance Issues**: Load balancing and caching strategies

### User Experience Issues
- **Learning Curve**: Progressive disclosure and contextual help
- **Data Loss Prevention**: Multiple backup layers and recovery
- **Accidental Actions**: Confirmation dialogs for destructive operations
- **Performance Feedback**: Loading indicators and progress tracking

## Success Metrics & Validation

### Engagement Metrics
- **Session Duration**: Time spent in each domain
- **Feature Adoption**: Usage rates of AI and collaboration features
- **Content Creation**: Volume of evidence, analytics, and cases created
- **Tournament Performance**: Correlation with competitive success

### User Satisfaction
- **Task Completion**: Success rates for core workflows
- **Learning Curve**: Time to proficiency measurement
- **Feature Requests**: User-driven enhancement priorities
- **Retention Rates**: Long-term platform engagement 