# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MindScribe AI is a full-stack mental health journaling platform with AI-powered insights. The application helps users track mood, generate actionable improvement tasks, and visualize emotional patterns over time.

### Architecture
- **Backend**: FastAPI with SQLAlchemy ORM and JWT authentication
- **Frontend**: React 18 + TypeScript + Vite with Tailwind CSS
- **Database**: MySQL (production) / SQLite (development)
- **AI Integration**: OpenAI API for insights and personalized messaging
- **Deployment**: Heroku with Gunicorn

## Development Commands

### Frontend Development (clientside/)
```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript compilation + production build
npm run lint      # ESLint code quality checks
npm run preview   # Preview production build
```

### Backend Development (backend_fastapi/)
```bash
uvicorn app.main:app --reload    # Start FastAPI dev server with auto-reload
python scripts/init_db.py       # Initialize database tables
```

### Full-Stack Build (root level)
```bash
npm run build        # Build frontend and install dependencies
npm run postinstall  # Install frontend dependencies only
```

## Core Data Models & Relationships

The application centers around these key models in `backend_fastapi/app/models/`:

- **User**: Authentication and profile data with relationships to all other entities
- **JournalEntry**: User journal content with mood ratings (integer scale)
- **Insight**: AI-generated insights from journal analysis (keywords, themes, sentiment)
- **UserImprovement**: Daily personalized improvement plans (one per user per day)
- **ActionableTask**: Trackable tasks linked to improvements with progress states
- **UserPreferences**: Companion type and messaging style customization

### Key Constraints
- Tasks have states: pending → in_progress → completed (boolean flags)
- User preferences linked via unique foreign key constraint
- Journal entries cascade delete to insights

## API Architecture

FastAPI backend with automatic OpenAPI documentation. Core endpoints in `/api/v1/`:

```
/auth/          # JWT authentication (login, register, refresh)
/users/         # User profile management
/journals/      # CRUD for journal entries
/insights/      # AI-generated insights
/improvements/  # Daily improvement plans and tasks
/preferences/   # User customization settings
```

Authentication uses JWT tokens with configurable expiration (8 days default).

## Frontend Component Structure

Components are organized by feature areas in `clientside/src/components/pages/`:
- `mainPage/`: Journal dashboard and entry creation
- `statsPage/`: Data visualization and mood analytics  
- `improvementsPage/`: Task management and progress tracking
- `settingsPage/`: User preferences and customization
- `homePage/`: Landing, login, and registration pages
- `trackTasksPage/`: Task tracking interface

State management uses React Context for authentication, local state for components.

## Configuration & Environment

### Backend Configuration
- **Database**: MySQL via SQLAlchemy with PyMySQL driver
- **Security**: Configurable secret key and token expiration
- **AI Integration**: OpenAI API key from environment variables
- **Settings**: Centralized in `app/core/config.py` with Pydantic

### Frontend Configuration
- **Build Tool**: Vite with TypeScript and React
- **Styling**: Tailwind CSS with custom configurations
- **Development**: Hot module replacement and ESLint integration

## Database Schema

SQLAlchemy models with automatic timestamp management:
- Created/updated timestamps on all entities
- Foreign key relationships with proper cascading
- MySQL-specific configurations for production deployment

## Development Environment Setup

- **Node.js**: v14.x (specified in engines)
- **Python**: FastAPI 0.110.0 with SQLAlchemy 2.0.23
- **Database**: MySQL (production) or SQLite (development)
- **Environment Variables**: OpenAI API key required for AI features
- **CORS**: Configured for cross-origin requests between React frontend and FastAPI backend