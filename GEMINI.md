# GEMINI.md

This file provides a comprehensive overview of the **Gloria Connect App** for AI agents. Adhere to these instructions to ensure consistency with the existing codebase and architecture.

## Project Overview

**Gloria Connect App** is a modern local business directory application designed for the Gloria community. It enables users to discover, search for, and connect with local businesses.

### Core Technologies
- **Frontend Framework:** Next.js 16 (App Router) with React 19.
- **Backend/Database:** [Convex](https://convex.dev) for real-time data sync and backend functions.
- **Styling:** Tailwind CSS 4 with [shadcn/ui](https://ui.shadcn.com) and Radix UI components.
- **Authentication:** [@convex-dev/auth](https://labs.convex.dev/auth) for Convex-native authentication.
- **Forms:** [@tanstack/react-form](https://tanstack.com/form) with [Zod](https://zod.dev) for schema validation.
- **Data Tables:** [@tanstack/react-table](https://tanstack.com/table) for powerful, headless table management.
- **Internationalization:** Multi-language support (English and Filipino) via `next-intl` patterns and `messages/` directory.
- **Testing:** Vitest for unit and integration testing.

---

## Architecture & Project Structure

The project follows a standard Next.js App Router structure with a Convex backend.

- `convex/`: Contains backend logic, including `schema.ts`, auth configuration, and API functions (queries, mutations, actions).
  - **CRITICAL:** Always read `convex/_generated/ai/guidelines.md` before modifying any Convex code.
- `src/app/`: Next.js App Router pages, organized into route groups:
  - `(admin)/`: Admin-only dashboard and management routes.
  - `(auth)/`: Authentication routes (login, register, verify-email).
  - `(main)/`: Public-facing pages (home, about, business listings).
- `src/components/`: Reusable React components.
  - `ui/`: shadcn/ui base components.
- `src/hooks/`: Custom React hooks (e.g., `use-convex-error.ts`, `useLanguagePersistence.ts`).
- `src/lib/`: Shared utilities and Zod schemas (`src/lib/schemas`).
- `messages/`: i18n translation files (`en.json`, `fil.json`).

---

## Building and Running

### Development
```bash
# Run both Next.js dev server and Convex backend (Recommended)
npm run dev:all

# Run Next.js dev server only
npm run dev

# Run Convex backend only
npm run convex
```

### Build & Test
```bash
# Build for production
npm run build

# Run all checks (lint + typecheck)
npm run check

# Run tests
npm run test
```

---

## Engineering Standards

### Coding Conventions
- **TypeScript:** Use strict typing. Avoid `any` at all costs.
- **Form Management:** Always use `@tanstack/react-form` combined with Zod for schema-based validation.
- **Data Fetching:** Use Convex queries and mutations via the `useQuery` and `useMutation` hooks from `convex/react`.
- **Styling:** Use Tailwind utility classes. Prefer CSS variables for theme-aware colors (configured in `globals.css`).
- **i18n:** Ensure all user-facing text is translated using the established `messages/` files. Use the `t()` function from `next-intl` patterns where applicable.

### Testing Practices
- **Vitest:** Use Vitest for all unit tests.
- **Locality:** Keep test files close to the code they test (e.g., `utils.test.ts` next to `utils.ts`).
- **Setup:** Global test setup is located in `src/test/setup.ts`.

### Convex-Specific Rules
- **Schema:** The source of truth for the database is `convex/schema.ts`.
- **Generated Code:** Never manually edit files in `convex/_generated/`.
- **AI Guidelines:** Adhere strictly to the rules in `convex/_generated/ai/guidelines.md`.

---

## Key Files Summary

- `convex/schema.ts`: Defines the database tables (`users`, `businesses`, `authAccounts`, etc.).
- `src/app/layout.tsx`: Root layout with font and SEO configuration.
- `package.json`: Project dependencies and scripts.
- `DESIGN_SYSTEM.md`: Guidelines for UI/UX consistency (if exists).
- `README.md`: High-level project documentation.
