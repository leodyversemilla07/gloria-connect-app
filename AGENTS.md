# Development Guide

## Commands

```bash
# Run both Next.js dev server and Convex backend
npm run dev:all

# Run Next.js dev server only
npm run dev

# Run Convex backend only
npm run convex

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run typecheck

# Run all checks (lint + typecheck)
npm run check

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/` - Utilities and schemas
- `convex/` - Convex backend functions
- `messages/` - i18n translation files (en.json, fil.json)
