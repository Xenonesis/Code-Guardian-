# Hackathon Guide

## Overview
This document provides information about participating in hackathons with this project.

## Project Description
This appears to be a code analysis and security scanning tool with features including:
- AI-powered security insights
- Code analysis and metrics
- Language detection
- Security vulnerability scanning
- Performance optimization tools

## Quick Start for Hackathons

### Prerequisites
- **Node.js** (version 18+ recommended)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Instructions

#### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd code-guardian-report

# Install dependencies
npm install
```

#### 2. Environment Configuration (Optional)
```bash
# Copy environment template (optional for basic functionality)
cp .env.example .env.local

# Edit .env.local to configure AI providers (optional)
# The app works without API keys for basic analysis
```

#### 3. Development Server
```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Alternative commands:
npm start              # Same as npm run dev
npm run dev --host     # Expose to network (already configured)
```

#### 4. Testing & Quality Assurance
```bash
# Run tests
npm test               # Interactive test runner
npm run test:run       # Run tests once
npm run test:coverage  # Generate coverage report
npm run test:ui        # Visual test interface

# Type checking
npm run type-check     # TypeScript validation
```

#### 5. Production Build
```bash
# Build for production
npm run build                    # Standard build
npm run build:production         # Optimized production build

# Preview production build
npm run preview                  # Runs on http://localhost:4173
```

### Quick Demo Setup
1. **Start the app**: `npm run dev`
2. **Upload test files**: Use the drag-and-drop interface
3. **Explore features**: Try different analysis tabs
4. **Check results**: View security insights and metrics

### Key Features to Showcase
- **Security Analysis**: Advanced security scanning with AI-powered insights
- **Code Metrics**: Comprehensive code quality and complexity analysis
- **Multi-language Support**: Automatic language detection and analysis
- **Modern UI**: Clean, responsive interface with dark mode support
- **Performance Optimized**: Fast analysis with efficient data processing

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint

### Potential Hackathon Enhancements
- Add new security analysis rules
- Integrate additional AI services
- Implement real-time collaboration features
- Add support for new programming languages
- Create mobile-responsive improvements
- Develop API integrations
- Add data visualization features

### Demo Tips
1. Upload sample code files to demonstrate analysis
2. Show security vulnerability detection
3. Highlight AI-powered fix suggestions
4. Demonstrate the analytics dashboard
5. Show language detection capabilities

## Contributing
Feel free to fork this project and build upon it for your hackathon submission!