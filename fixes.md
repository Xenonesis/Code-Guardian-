# Replit.md - Competitor Intelligence Tracker

## Overview

This is a full-stack competitor intelligence tracking application built with Express.js and React. The system automatically monitors competitor websites, social media, and other sources for updates, classifies them using AI, and sends digestible reports via Slack. It provides a comprehensive dashboard for tracking competitive intelligence across multiple sources and competitors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Build System**: ESBuild for production builds
- **Development**: tsx for TypeScript execution

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and bundling

### Development Environment
- **Package Manager**: npm
- **Type Checking**: TypeScript with strict mode
- **Code Structure**: Monorepo with shared types between client and server

## Key Components

### Database Schema (shared/schema.ts)
- **Competitors**: Store competitor information (name, description, website, logo)
- **Sources**: Track data sources per competitor (websites, social media, RSS feeds)
- **Updates**: Store scraped content from sources
- **Classifications**: AI-powered categorization of updates (Feature, Bug Fix, UI Update, Pricing, Integration)
- **Digests**: Weekly summaries of competitor activity

### Backend Services
- **Web Scraper**: Puppeteer-based scraping with rate limiting and error handling
- **OpenAI Integration**: Content classification and digest generation using GPT-4o
- **Slack Integration**: Automated notifications and weekly digest delivery
- **Scheduler**: Cron-based job scheduling for automated scraping and digest generation
- **Storage Layer**: Database abstraction layer with comprehensive CRUD operations

### Frontend Pages
- **Dashboard**: Overview of competitor activity, stats, and recent updates
- **Sources**: Management interface for configuring competitor data sources
- **Real-time Updates**: Recent competitor updates with AI classifications

### UI Components
- Custom components built on Radix UI primitives
- Responsive design with mobile support
- Toast notifications for user feedback
- Modal forms for data entry
- Stats cards for dashboard metrics

## Data Flow

1. **Data Collection**: Scheduled scrapers collect data from configured sources (websites, social media, RSS feeds)
2. **Content Processing**: Raw content is cleaned, deduplicated using content hashes
3. **AI Classification**: OpenAI GPT-4o analyzes content to categorize updates and assess impact
4. **Storage**: Processed data is stored in PostgreSQL with proper relationships
5. **Notifications**: High-impact updates trigger immediate Slack alerts
6. **Digest Generation**: Weekly summaries are generated and sent via Slack
7. **Frontend Display**: React dashboard presents data with real-time updates via React Query

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL (serverless)
- **AI Processing**: OpenAI API (GPT-4o model)
- **Notifications**: Slack Web API
- **Web Scraping**: Puppeteer for dynamic content

### Development Tools
- **UI Components**: Radix UI ecosystem
- **Styling**: Tailwind CSS with shadcn/ui theme system
- **Validation**: Zod for runtime type checking
- **Forms**: React Hook Form with Zod resolvers
- **HTTP Client**: Built-in fetch with React Query

### Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access
- `SLACK_BOT_TOKEN`: Slack bot authentication
- `SLACK_CHANNEL_ID`: Default Slack channel for notifications

## Deployment Strategy

### Production Build
- **Backend**: ESBuild bundles server code into `dist/index.js`
- **Frontend**: Vite builds React app into `dist/public`
- **Database**: Drizzle migrations handle schema changes
- **Environment**: NODE_ENV=production for optimized builds

### Development Setup
- **Concurrent Processes**: Server runs on Express, frontend on Vite dev server
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Database**: Drizzle push for development schema updates
- **Debugging**: Source maps enabled for both frontend and backend

### Key Features
- **Automated Monitoring**: Configurable scraping frequencies (6 hours, daily, weekly)
- **AI-Powered Intelligence**: Automatic categorization and impact assessment
- **Real-time Notifications**: Slack integration for immediate alerts
- **Comprehensive Dashboard**: Visual analytics and trend tracking
- **Error Handling**: Robust error recovery and status monitoring
- **Rate Limiting**: Respectful scraping with domain-based rate limits