# Logos AI - Debate Research Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kaushalbalagurusamy-7779s-projects/v0-logos-ai)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/LlclSV6Lyjk)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

> AI-powered debate research and case building platform designed to revolutionize how debaters manage evidence, construct analytics, build cases, and deliver speeches.

## 🎯 Project Overview

Logos AI combines traditional debate preparation tools with modern AI assistance to enhance research efficiency and strategic thinking. The platform features a VS Code-inspired interface optimized for debate research workflows.

### Core Features

- **🔍 Evidence Management**: Source-based evidence card system with AI-powered organization
- **📊 Analytics Creation**: Rich text analytics with linking to source material  
- **📋 Case Building**: Template-based case construction with evidence integration
- **🎤 Speech Preparation**: AI-assisted speech writing and flow management
- **🤖 AI Assistant**: Research assistance and citation management

## 📚 Documentation

Comprehensive project documentation is available in the `_docs/` directory:

### Core Documentation
- **[Project Overview](_docs/project-overview.md)** - Vision, features, and technical architecture
- **[User Flow](_docs/user-flow.md)** - Complete user journey and interface interactions
- **[Technology Stack](_docs/tech-stack.md)** - Technical decisions and implementation details
- **[UI Guidelines](_docs/ui-rules.md)** - Design system and component standards
- **[Theme Rules](_docs/theme-rules.md)** - Color system, typography, and styling foundations
- **[Project Rules](_docs/project-rules.md)** - File structure, naming conventions, and organization

### Development Phases
- **[Phase 1: Setup & Foundation](_docs/phases/phase-1-setup.md)** - ✅ Complete
- **[Phase 2: Evidence Management MVP](_docs/phases/phase-2-evidence-mvp.md)** - 🚧 Next

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL (for Phase 2+)

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd logos-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database configuration

# For PostgreSQL Database (Production):
# Uncomment and configure DATABASE_URL in .env.local
# DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres

# Run database migrations (if using PostgreSQL)
pnpm migrate

# Start development server
pnpm dev

# Open in browser
open http://localhost:3000
```

### Database Configuration

The application supports both mock database (development) and PostgreSQL (production):

#### Mock Database (Default)
- No setup required
- Data stored in memory during development
- Automatically used when `DATABASE_URL` is not set

#### PostgreSQL Database
1. **Set up Supabase or PostgreSQL instance**
2. **Configure connection string in `.env.local`:**
   ```bash
   # Direct Connection (for VMs/containers)
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   
   # Transaction Pooler (for serverless)
   DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres
   ```
3. **Run migrations:**
   ```bash
   pnpm migrate
   ```

### Project Structure

```
logos-ai/
├── _docs/                    # 📖 Project documentation
├── app/                      # 🏗️ Next.js App Router
│   ├── api/                 # 🔌 API route handlers
│   └── (auth)/              # 🔐 Authentication routes
├── components/              # ⚛️ React components
│   ├── ui/                  # 🎨 Shadcn UI components
│   ├── analytics/           # 📊 Analytics domain
│   └── sources/             # 📚 Source management
├── lib/                     # 🛠️ Core utilities
│   ├── services/            # 🏢 Business logic
│   └── middleware/          # 🔧 Custom middleware
└── hooks/                   # 🎣 Custom React hooks
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library built on Radix UI

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Primary database (Phase 2+)
- **JWT Authentication** - Secure user sessions
- **OpenAI API** - AI-powered features

### Development Tools
- **pnpm** - Fast package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform

## 🎨 Design System

The platform uses a VS Code-inspired design with:

- **Dark Theme Primary** - Professional development environment aesthetic
- **Activity-Based Navigation** - Domain-focused workflow separation
- **Rich Text Editing** - Debate-specific formatting capabilities
- **Responsive Design** - Mobile-first approach with desktop optimization

## 🔧 Development Workflow

### Code Standards
- **200 line limit** per file (strictly enforced)
- **TypeScript strict mode** required
- **Comprehensive JSDoc** documentation
- **Functional programming** patterns preferred
- **Error handling** without fallback values

### Architecture Principles
- **Service-oriented** architecture with clear separation
- **AI-first** development approach
- **Documentation-driven** development
- **Modularity** and reusability emphasis

## 🚀 Deployment

### Live Application
**Production**: [https://vercel.com/kaushalbalagurusamy-7779s-projects/v0-logos-ai](https://vercel.com/kaushalbalagurusamy-7779s-projects/v0-logos-ai)

### Build and Deploy

```bash
# Production build
pnpm build

# Start production server
pnpm start

# Deploy to Vercel
vercel deploy
```

## 📈 Development Status

### Current Phase: Phase 1 Complete ✅
- VS Code-inspired interface implemented
- Basic analytics management functional
- Service layer architecture established
- Rich text editor foundation complete

### Next Phase: Evidence Management MVP 🚧
- Source document upload and processing
- Evidence card creation and formatting
- Database integration
- Basic authentication system

## 🤝 Contributing

### Development Process
1. Review project documentation in `_docs/`
2. Follow established code standards and architecture
3. Maintain file size limits and documentation requirements
4. Test thoroughly before submitting changes

### Code Review Checklist
- [ ] TypeScript strict mode passes
- [ ] All files under 200 lines
- [ ] Comprehensive JSDoc documentation
- [ ] Error handling implemented
- [ ] Tests written for new functionality

## 📄 License

This project is part of the v0.dev ecosystem and follows their licensing terms.

## 🔗 Related Links

- **[v0.dev Project](https://v0.dev/chat/projects/LlclSV6Lyjk)** - Continue building on v0.dev
- **[Deployment](https://vercel.com/kaushalbalagurusamy-7779s-projects/v0-logos-ai)** - Live application
- **[Documentation](_docs/)** - Comprehensive project docs

---

**Built with ❤️ for the debate community using modern web technologies and AI assistance.**