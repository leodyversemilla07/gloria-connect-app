# Gloria Connect App

A modern local business directory application built with Next.js 16 and Convex backend.

## Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework

### Backend
- **[Convex](https://convex.dev)** - Backend platform with real-time sync
- **[@convex-dev/auth](https://labs.convex.dev/auth)** - Authentication for Convex

### Form Management
- **[@tanstack/react-form](https://tanstack.com/form)** - Headless form library with first-class TypeScript support
- **[Zod](https://zod.dev)** - TypeScript-first schema validation

### Data Tables
- **[@tanstack/react-table](https://tanstack.com/table)** - Headless table library for building powerful tables

### UI Components
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable components built with Radix UI and Tailwind CSS
- **[Radix UI](https://www.radix-ui.com)** - Unstyled, accessible UI components
- **[Lucide React](https://lucide.dev)** - Beautiful icons
- **[Tabler Icons](https://tabler.io/icons)** - Additional icon set

### Drag and Drop
- **[@dnd-kit](https://dndkit.com)** - Modern drag and drop toolkit

### Charts
- **[Recharts](https://recharts.org)** - Composable charting library

### Other
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Sonner](https://sonner.emilkowal.ski)** - Toast notifications
- **[Vaul](https://vaul.emilkowal.ski)** - Drawer component

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── (auth)/            # Authentication routes
│   └── (main)/            # Main public routes
├── components/
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature components
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization
└── lib/                   # Utility functions
convex/                    # Convex backend functions
messages/                  # i18n translation files
```

## Form Examples

This project uses TanStack Form with Zod validation. Example usage:

```tsx
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const form = useForm({
  defaultValues: { email: "", password: "" },
  validators: { onSubmit: formSchema },
  onSubmit: async ({ value }) => {
    // Handle submission
  },
})
```

## Data Table Examples

This project uses TanStack Table for data tables:

```tsx
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [TanStack Form Documentation](https://tanstack.com/form/latest)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
