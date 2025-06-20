# TaskFlow - Personal Productivity Management System

## Overview

TaskFlow is a comprehensive personal productivity application built with a modern full-stack architecture. It combines task management, habit tracking, analytics, gamification, and AI-powered insights to help users optimize their productivity and achieve their goals.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication, React Query for server state
- **Routing**: React Router for client-side navigation
- **Styling**: Tailwind CSS with custom design system, dark/light theme support

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **API Design**: RESTful API structure with Express routing
- **Session Management**: PostgreSQL-based session storage

### Database Design
- **Primary Database**: PostgreSQL hosted on Neon/Supabase
- **ORM**: Drizzle with type-safe schema definitions
- **Migration Strategy**: Drizzle migrations with version control
- **Schema**: User profiles, tasks, habits, activities, user roles, and gamification data

## Key Components

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect integration
- **Security**: PostgreSQL-based session storage with secure user isolation
- **Session Management**: Express sessions with automatic refresh and cross-device sync
- **User Profiles**: Replit user data with profile images and basic information
- **Cross-Device Sync**: Automatic synchronization of tasks, habits, and activities across all devices

### Task Management System
- **Features**: Create, update, delete, and complete tasks
- **Priority Levels**: Low, medium, high priority classification
- **Categories**: Customizable task categorization
- **Filtering**: Search and filter by status, priority, and category
- **Due Dates**: Optional deadline tracking

### Habit Tracking System
- **Streak Tracking**: Daily/weekly habit completion streaks
- **Categories**: Customizable habit categorization
- **Frequency Options**: Daily or weekly target frequencies
- **Progress Visualization**: Visual progress indicators and statistics

### Analytics & Insights
- **Performance Metrics**: Task completion rates, habit consistency
- **Data Visualization**: Charts and graphs using Recharts library
- **Productivity Scoring**: AI-generated productivity assessments
- **Trend Analysis**: Historical performance tracking

### Gamification Engine
- **Achievement System**: Unlockable achievements based on user behavior
- **Level Progression**: Experience points and level-based rewards
- **Daily Challenges**: Dynamic challenge generation
- **Leaderboards**: Community comparison features

### AI-Powered Features
- **Task Suggestions**: AI-generated task recommendations
- **Habit Optimization**: Personalized habit improvement suggestions
- **Smart Scheduling**: Optimal time slot recommendations
- **Productivity Insights**: Pattern recognition and improvement advice

### Social Features
- **Progress Sharing**: Social media integration for sharing achievements
- **Community Feed**: User interaction and motivation features
- **Achievement Broadcasting**: Celebrate milestones with others

## Data Flow

### Authentication Flow
1. User signs up/signs in through Supabase Auth
2. JWT tokens stored in browser with automatic refresh
3. RLS policies enforce data isolation per user
4. User profile created/updated in profiles table

### Task Management Flow
1. Tasks created through TaskManagerDB component
2. Data persisted to PostgreSQL via Supabase client
3. Real-time updates through React Query invalidation
4. Activity feed updated for task completions

### Habit Tracking Flow
1. Habits tracked through HabitTrackerDB component
2. Streak calculations performed on completion
3. Daily/weekly progress stored and analyzed
4. Achievement checks triggered on habit updates

### Analytics Generation
1. Raw data aggregated from tasks and habits tables
2. Client-side analytics service processes data
3. Charts and insights generated using Recharts
4. Performance scores calculated using custom algorithms

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React Router, React Query
- **UI Libraries**: Radix UI primitives, Tailwind CSS, Lucide icons
- **Database**: Supabase client, Drizzle ORM, Neon serverless
- **Charts**: Recharts for data visualization
- **Utilities**: date-fns for date handling, clsx for conditional styling

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with hot module replacement
- **Drizzle Kit**: Database migration and schema management

### Third-party Integrations
- **Supabase**: Authentication, database, and real-time features
- **Neon**: Serverless PostgreSQL hosting
- **OpenAI API**: AI-powered insights and suggestions (optional)
- **Social Platforms**: Twitter, LinkedIn, Facebook sharing APIs

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Local PostgreSQL or Supabase development instance
- **Environment Variables**: Database URL, Supabase keys

### Production Deployment
- **Platform**: Replit with autoscale deployment target
- **Build Process**: Vite build for frontend, ESBuild for backend
- **Database**: Production PostgreSQL instance
- **Static Assets**: Served from dist/public directory
- **Port Configuration**: Port 5000 mapped to external port 80

### Environment Configuration
- **Node.js 20**: Modern runtime with ES modules support
- **PostgreSQL 16**: Latest stable database version
- **Auto-scaling**: Handled by Replit deployment platform

## Changelog

- June 20, 2025. Initial setup
- June 20, 2025. Successfully migrated from Lovable to Replit with cross-device synchronization
  - Migrated from Supabase to PostgreSQL with Drizzle ORM
  - Implemented Replit Auth for secure user authentication
  - Added cross-device data synchronization for tasks, habits, and activities
  - Created database session management for persistent login across devices

## User Preferences

Preferred communication style: Simple, everyday language.