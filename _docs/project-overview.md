# Logos AI Project Overview

## Vision Statement
Logos AI is an AI-powered debate research and case building platform designed to revolutionize how debaters manage evidence, construct analytics, build cases, and deliver speeches. The platform combines traditional debate preparation tools with modern AI assistance to enhance research efficiency and strategic thinking.

## Context
@context {
  "type": "project_overview",
  "phase": "development",
  "scope": "full_stack_application",
  "purpose": "debate_research_platform",
  "last_updated": "2024-12-20"
}

## Core Purpose
Transform the debate preparation process by providing:
- **Intelligent Evidence Management**: Source-based evidence card system with AI-powered organization
- **Advanced Analytics Creation**: Rich text analytics with linking to source material
- **Case Building Tools**: Template-based case construction with evidence integration
- **Speech Preparation**: AI-assisted speech writing and flow management
- **Research Enhancement**: AI-powered research assistance and citation management

## Target Users
- **Competitive Debaters**: High school and college students participating in policy debate, Lincoln-Douglas, and other formats
- **Debate Coaches**: Educators managing teams and teaching argumentation skills  
- **Debate Teams**: Collaborative research and case sharing within organizations
- **Research Enthusiasts**: Anyone engaged in structured argumentation and evidence analysis

## Core Features

### Evidence Management System
- **Source Management**: Upload, organize, and cite academic papers, articles, and research
- **Evidence Cards**: Extract, format, and tag specific evidence with rich text formatting
- **Citation Automation**: Automatic citation generation in MLA, APA, and Chicago formats
- **Qualification Tracking**: Author credentials and study methodology documentation

### Analytics Platform
- **Rich Text Editor**: Advanced formatting with emphasis, highlighting, and minimization
- **Source Linking**: Connect analytics to specific evidence cards and sources
- **Organizational Structure**: Folder-based analytics organization with nested hierarchies
- **Link Types**: Paraphrase, comparison, extension, and response relationships

### Case Building Tools
- **Template System**: Pre-built case structures for different debate formats
- **Evidence Integration**: Drag-and-drop evidence insertion into case documents
- **Collaboration Features**: Team-based case development and sharing
- **Version Control**: Track changes and maintain case history

### AI-Powered Assistance
- **Research Assistant**: AI-powered source discovery and evidence extraction
- **Citation Formatting**: Automatic citation style conversion and validation
- **Content Summarization**: AI-generated summaries of complex sources
- **Strategic Analysis**: AI insights on argument strength and logical connections

## Technical Architecture

### Frontend Technology Stack
- **Framework**: Next.js 15 with App Router
- **React Version**: React 19 with Server Components
- **UI Library**: Shadcn/UI built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Server Components with minimal client state
- **Rich Text Editing**: Custom editor with formatting capabilities

### Backend Architecture
- **API Design**: RESTful API with Next.js App Router
- **Service Layer**: Domain-driven service architecture
- **Authentication**: JWT-based authentication with role-based access
- **Database**: PostgreSQL with type-safe queries
- **File Management**: Cloud storage for document uploads
- **AI Integration**: OpenAI API for intelligent features

### Development Standards
- **TypeScript**: Strict type safety throughout the application
- **Code Organization**: Modular architecture with clear separation of concerns
- **Documentation**: Comprehensive inline documentation and project guides
- **Testing**: Component and service testing with automated validation
- **Performance**: Optimized for Web Vitals and user experience

## Project Structure

### Application Domains
1. **Evidence Domain**: Source and evidence card management
2. **Analytics Domain**: Research analysis and note-taking
3. **Case Building Domain**: Structured argument construction
4. **Speech Domain**: Presentation preparation and delivery tools
5. **AI Domain**: Intelligent assistance and automation

### User Workflow
1. **Research Phase**: Upload sources, extract evidence, create initial analytics
2. **Analysis Phase**: Develop detailed analytics with source connections
3. **Case Building Phase**: Construct arguments using evidence and analytics
4. **Speech Preparation**: Organize materials for tournament delivery
5. **Performance Review**: Analyze round results and improve strategies

## Success Metrics
- **User Engagement**: Daily active users and session duration
- **Research Efficiency**: Time reduction in evidence preparation
- **Academic Performance**: Tournament success rates of platform users
- **Content Creation**: Volume of evidence cards and analytics created
- **AI Utilization**: Adoption rate of AI-powered features

## Competitive Advantages
- **AI Integration**: First-class AI assistance throughout the research process
- **Modern Interface**: VS Code-inspired UI familiar to technical users
- **Comprehensive Platform**: All-in-one solution from research to delivery
- **Educational Focus**: Purpose-built for academic debate requirements
- **Collaboration Features**: Team-based workflows and knowledge sharing

## Future Roadmap
- **Mobile Application**: iOS and Android apps for tournament use
- **Advanced AI**: Custom debate-specific AI models and training
- **Tournament Integration**: Direct integration with tournament management systems
- **Analytics Dashboard**: Performance metrics and improvement suggestions
- **Community Features**: Public evidence sharing and debate forums

## Development Philosophy
The platform follows an AI-first development approach with systematic documentation, modular architecture, and iterative enhancement. Every component is designed for scalability, maintainability, and optimal user experience in competitive debate environments. 