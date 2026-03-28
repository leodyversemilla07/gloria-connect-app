# Gloria Local Connect — Design System

> **Version:** 1.0  
> **Last Updated:** February 2026  
> **Status:** Living Document

---

## 1. Project Overview

### What is Gloria Local Connect?

**Gloria Local Connect** is a **bilingual local business directory web application** for the municipality of **Gloria, Oriental Mindoro, Philippines**. It serves as a digital bridge between the local community and businesses, enabling residents and visitors to discover, search, and connect with businesses in the area.

### Core Purpose

| Goal | Description |
|------|-------------|
| **Discovery** | Help users find local businesses by category, search, and location |
| **Connection** | Provide direct contact options (call, directions, email, website) |
| **Administration** | Enable admins to manage business listings, categories, and users |
| **Bilingual Access** | Serve content in both **English** and **Filipino (Tagalog)** |
| **Community Building** | Foster local economic growth through digital visibility |

### Target Audience

- **Residents** of Gloria, Oriental Mindoro looking for local services
- **Visitors/Tourists** exploring the area
- **Business Owners** wanting visibility in the community
- **Municipal Administrators** managing the directory

---

## 2. Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 16 (App Router) · React 19 · TypeScript            │
│  Tailwind CSS 4 · shadcn/ui (New York) · Radix UI           │
├─────────────────────────────────────────────────────────────┤
│                        Backend                               │
│  Convex (Real-time BaaS) · @convex-dev/auth                 │
├─────────────────────────────────────────────────────────────┤
│                     Form & Validation                        │
│  TanStack Form · Zod v4                                      │
├─────────────────────────────────────────────────────────────┤
│                      Data Display                            │
│  TanStack Table · Recharts                                   │
├─────────────────────────────────────────────────────────────┤
│                        Utilities                             │
│  next-themes · Sonner (toasts) · Vaul (drawer)               │
│  Lucide React + Tabler Icons · date-fns · @dnd-kit           │
└─────────────────────────────────────────────────────────────┘
```

### Route Architecture

```
src/app/
├── (main)/          → Public-facing pages (home, business listing, about)
├── (auth)/          → Authentication (login, register)
└── (admin)/         → Admin dashboard (protected, sidebar layout)
```

---

## 3. Design Principles

### 3.1 Locality-First
The design should feel **welcoming and community-oriented**. It reflects a small-town municipality — approachable, not corporate. Content must be bilingual (English/Filipino).

### 3.2 Accessibility
- All interactive components use **Radix UI primitives** (WCAG 2.1 AA compliant)
- Semantic HTML with `data-slot` attributes for component identification
- Focus-visible rings on all interactive elements
- Screen reader support with `sr-only` labels
- Responsive from mobile (320px) to desktop (1280px+)

### 3.3 Progressive Disclosure
- Hero section with search → Featured businesses → All businesses
- Business cards show summary → Detail page shows full info
- Admin dashboard cards → Drill-down into data tables

### 3.4 Dark Mode Native
Every color token has a light and dark variant. The system uses `oklch()` color space for perceptual uniformity.

---

## 4. Color System

### 4.1 Design Tokens (CSS Custom Properties)

The color system is built on **semantic tokens** using the `oklch()` color space. Colors are defined in `globals.css` and consumed via Tailwind CSS utility classes.

#### Base Palette — Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` — White | Page backgrounds |
| `--foreground` | `oklch(0.145 0 0)` — Near-black | Primary text |
| `--card` | `oklch(1 0 0)` — White | Card surfaces |
| `--card-foreground` | `oklch(0.145 0 0)` — Near-black | Card text |
| `--primary` | `oklch(0.205 0 0)` — Dark charcoal | CTA buttons, links, brand accent |
| `--primary-foreground` | `oklch(0.985 0 0)` — Off-white | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` — Light gray | Secondary surfaces, tags |
| `--secondary-foreground` | `oklch(0.205 0 0)` — Dark charcoal | Text on secondary |
| `--muted` | `oklch(0.97 0 0)` — Light gray | Disabled states, subtle bg |
| `--muted-foreground` | `oklch(0.556 0 0)` — Medium gray | Secondary text, captions |
| `--accent` | `oklch(0.97 0 0)` — Light gray | Hover states, highlights |
| `--destructive` | `oklch(0.577 0.245 27.325)` — Red | Errors, delete actions |
| `--border` | `oklch(0.922 0 0)` — Light gray | Borders, dividers |
| `--ring` | `oklch(0.708 0 0)` — Medium gray | Focus rings |

#### Base Palette — Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` — Near-black | Page backgrounds |
| `--foreground` | `oklch(0.985 0 0)` — Off-white | Primary text |
| `--card` | `oklch(0.205 0 0)` — Dark charcoal | Card surfaces |
| `--primary` | `oklch(0.922 0 0)` — Light gray | CTA buttons, links |
| `--primary-foreground` | `oklch(0.205 0 0)` — Dark charcoal | Text on primary |
| `--destructive` | `oklch(0.704 0.191 22.216)` — Bright red | Errors, delete actions |
| `--border` | `oklch(1 0 0 / 10%)` — White 10% | Borders |

#### Chart Colors (Data Visualization)

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` — Orange | `oklch(0.488 0.243 264.376)` — Indigo |
| `--chart-2` | `oklch(0.6 0.118 184.704)` — Teal | `oklch(0.696 0.17 162.48)` — Green |
| `--chart-3` | `oklch(0.398 0.07 227.392)` — Blue | `oklch(0.769 0.188 70.08)` — Gold |
| `--chart-4` | `oklch(0.828 0.189 84.429)` — Gold | `oklch(0.627 0.265 303.9)` — Violet |
| `--chart-5` | `oklch(0.769 0.188 70.08)` — Amber | `oklch(0.645 0.246 16.439)` — Red |

#### Sidebar Colors

| Token | Light | Dark |
|-------|-------|------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |

### 4.2 Semantic Color Usage

```
Text hierarchy:         foreground → muted-foreground
Surfaces:               background → card → muted → accent
Interactive:            primary (buttons) → secondary (subtle) → destructive (danger)
Status:                 green (#22c55e) → amber (#f59e0b) → red (#ef4444)
Featured badge:         yellow-500/yellow-900 (hardcoded for emphasis)
```

### 4.3 Color Recommendations for Gloria Branding

> **Current state:** The palette is neutral (grayscale) with no brand color. Consider adopting a **community-inspired primary color** such as:
> - **Forest Green** `oklch(0.55 0.15 155)` — representing Oriental Mindoro's natural landscape
> - **Ocean Blue** `oklch(0.55 0.15 240)` — reflecting coastal character
> - **Warm Gold** `oklch(0.75 0.15 85)` — symbolizing community warmth
>
> This would replace the current achromatic `--primary` with a chromatic token.

---

## 5. Typography

### 5.1 Font Stack

| Role | Font | Variable |
|------|------|----------|
| **Sans-serif (body)** | [Geist Sans](https://vercel.com/font) | `--font-geist-sans` |
| **Monospace (code)** | [Geist Mono](https://vercel.com/font) | `--font-geist-mono` |

Both fonts are loaded via `next/font/google` with `latin` subset and applied as CSS custom properties.

### 5.2 Type Scale

| Element | Class | Size | Weight | Usage |
|---------|-------|------|--------|-------|
| **Page Title** | `text-3xl md:text-4xl font-bold` | 30px / 36px | 700 | Page headings (H1) |
| **Section Title** | `text-xl sm:text-2xl font-bold` | 20px / 24px | 700 | Section headings (H2) |
| **Card Title** | `text-lg font-semibold` | 18px | 600 | Card headings (H3/H4) |
| **Subtitle** | `text-lg sm:text-xl opacity-90` | 18px / 20px | 400 | Hero subtitles |
| **Body** | `text-base` (default) | 16px | 400 | Body content |
| **Small/Caption** | `text-sm text-muted-foreground` | 14px | 400 | Descriptions, metadata |
| **Tiny** | `text-xs` | 12px | 500 | Badges, labels |
| **Brand Name** | `text-xl font-bold` | 20px | 700 | "Gloria Local Connect" in header |

### 5.3 Text Truncation

```css
.line-clamp-1  /* Business card titles */
.line-clamp-2  /* Business card descriptions */
```

---

## 6. Spacing & Layout

### 6.1 Container System

| Context | Max Width | Padding |
|---------|-----------|---------|
| **Main content** | `max-w-7xl` (1280px) | `px-4 sm:px-6 lg:px-8` |
| **Narrow content** (about) | `max-w-3xl` (768px) | `px-4 sm:px-6 lg:px-8` |
| **Auth forms** | `max-w-sm md:max-w-4xl` | `p-6 md:p-10` |
| **Admin sidebar** | `var(--sidebar-width): calc(var(--spacing) * 72)` | — |

### 6.2 Section Spacing

| Section | Vertical Padding |
|---------|-----------------|
| **Hero** | `py-8 md:py-12` |
| **Content sections** | `py-8 md:py-12` |
| **About page** | `py-12 md:py-20` |
| **Footer** | `py-8 md:py-12` |
| **Inter-card gap** | `gap-4 md:gap-6` |

### 6.3 Grid System

| Context | Grid |
|---------|------|
| **Business cards** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| **Footer** | `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` |
| **Dashboard stats** | `grid gap-4 md:grid-cols-2 lg:grid-cols-4` |
| **Dashboard main** | `grid gap-4 md:grid-cols-2 lg:grid-cols-7` (4+3 split) |
| **Photo gallery** | `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` |

### 6.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` (10px) | Base radius |
| `--radius-sm` | `calc(var(--radius) - 4px)` = 6px | Buttons (sm), inputs |
| `--radius-md` | `calc(var(--radius) - 2px)` = 8px | Default buttons |
| `--radius-lg` | `var(--radius)` = 10px | Cards |
| `--radius-xl` | `calc(var(--radius) + 4px)` = 14px | Large containers |

---

## 7. Component Library

### 7.1 Foundation Components (shadcn/ui — New York style)

All base components reside in `src/components/ui/` and use the **New York** variant of shadcn/ui with `neutral` base color.

#### Buttons

| Variant | Class | Usage |
|---------|-------|-------|
| **Default** | `bg-primary text-primary-foreground` | Primary CTAs (View Details, Login) |
| **Destructive** | `bg-destructive text-white` | Delete operations |
| **Outline** | `border bg-background` | Secondary actions (Get Directions, Website) |
| **Secondary** | `bg-secondary text-secondary-foreground` | Tertiary actions |
| **Ghost** | `hover:bg-accent` | Icon buttons, subtle actions |
| **Link** | `text-primary underline-offset-4` | Navigation links |

| Size | Height | Usage |
|------|--------|-------|
| **xs** | `h-6` | Compact actions |
| **sm** | `h-8` | Card footer buttons |
| **default** | `h-9` | Standard buttons |
| **lg** | `h-10` | Hero CTAs |
| **icon** | `size-9` | Theme toggle, share |

#### Cards

```
┌─────────────────────────────┐
│ CardHeader                  │  ← p-0 when containing images
│   ┌─────────────────────┐   │
│   │  Image (aspect-video)│  │
│   │  + Badge overlay     │  │
│   └─────────────────────┘   │
│ CardContent                 │  ← p-4, flex-col flex-1
│   Title (font-semibold)     │
│   Badge (category)          │
│   Description (line-clamp-2)│
│   Hours (icon + text)       │
│ CardFooter                  │  ← mt-auto
│   [View Details] [📞 Call]  │
└─────────────────────────────┘
```

- Border: `border rounded-xl`
- Background: `bg-card text-card-foreground`
- Shadow: `shadow-sm` → `hover:shadow-lg` on business cards

#### Badges

| Variant | Usage |
|---------|-------|
| **Default** | Primary labels |
| **Secondary** | Category tags on business cards |
| **Destructive** | Error/danger indicators |
| **Outline** | Specialties, subtle tags |
| **Custom** | `bg-yellow-500 text-yellow-900` — Featured badge |

#### Inputs & Forms

- Input height: `h-12` (hero search), `h-9` (default forms)
- Search input: with `Search` icon (`pl-10`)
- Select: Custom trigger with `SelectTrigger` → `SelectContent` → `SelectItem`
- Validation: Zod schemas + TanStack Form + `FieldError` display
- Field layout: `Field` → `FieldLabel` + `Input` + `FieldError` (vertical orientation)

### 7.2 Application Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `Header` | Main public navigation with logo, nav links, language toggle, theme toggle | `components/header.tsx` |
| `Footer` | 3-column footer with logo, quick links, contact info | `components/footer.tsx` |
| `BusinessCard` | Card displaying business summary with image, category, hours, CTA | `components/business-card.tsx` |
| `Logo` | Site logo using `next/image` with optional link wrapper | `components/logo.tsx` |
| `LanguageToggle` | English/Filipino language switcher via Select | `components/language-toggle.tsx` |
| `ThemeToggle` | Light/dark mode toggle button | `components/ui/theme-toggle.tsx` |
| `ThemeProvider` | `next-themes` wrapper | `components/theme-provider.tsx` |
| `LoginForm` | Two-column auth form with social login options | `components/login-form.tsx` |
| `RegisterForm` | Registration form with name, email, password | `components/register-form.tsx` |
| `AdminGuard` | Route protection HOC for admin pages | `components/admin-guard.tsx` |
| `AppSidebar` | Admin sidebar with nav items using Tabler Icons | `components/app-sidebar.tsx` |
| `SiteHeader` | Admin top bar | `components/site-header.tsx` |
| `BusinessDataTable` | Data table for admin business management | `components/business-data-table.tsx` |
| `SectionCards` | Dashboard summary stat cards | `components/section-cards.tsx` |

### 7.3 Layout Patterns

#### Public Pages (`(main)/`)
```
┌──────────────────────────────┐
│  Header (sticky, z-50)       │
│  ┌────────────────────────┐  │
│  │  Hero (gradient bg)    │  │
│  │  Search + Category     │  │
│  └────────────────────────┘  │
│  Featured Businesses Grid    │
│  All Businesses Grid         │
│  Footer (border-t)           │
└──────────────────────────────┘
```

#### Auth Pages (`(auth)/`)
```
┌──────────────────────────────┐
│  bg-muted centered           │
│  ┌────────────────────────┐  │
│  │  Card (2-col on md+)   │  │
│  │  ┌──────┬───────────┐  │  │
│  │  │ Form │   Image    │  │  │
│  │  └──────┴───────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

#### Admin Pages (`(admin)/`)
```
┌────────┬─────────────────────┐
│Sidebar │  SiteHeader          │
│  Logo  ├─────────────────────┤
│  Nav   │  Content             │
│  ...   │  (AdminGuard wraps)  │
│  User  │                      │
└────────┴─────────────────────┘
```

---

## 8. Iconography

### 8.1 Icon Libraries

| Library | Usage | Import |
|---------|-------|--------|
| **Lucide React** | Public-facing pages, UI components | `lucide-react` |
| **Tabler Icons** | Admin sidebar, form icons | `@tabler/icons-react` |

### 8.2 Standard Icons

| Icon | Usage | Library |
|------|-------|---------|
| `Search` | Search input | Lucide |
| `Phone` | Call button, contact | Lucide |
| `Clock` | Operating hours | Lucide |
| `MapPin` | Address/location | Lucide |
| `Globe` | Website link | Lucide |
| `Mail` | Email contact | Lucide |
| `Share2` | Share button | Lucide |
| `Navigation` | Get directions | Lucide |
| `ArrowLeft` | Back navigation | Lucide |
| `Sun` / `Moon` | Theme toggle | Lucide |
| `Building2` | Total businesses stat | Lucide |
| `CheckCircle` | Verified status | Lucide |
| `XCircle` | Inactive status | Lucide |
| `TrendingUp` | Trends/analytics | Lucide |
| `Plus` | Add new item | Lucide |
| `Eye` / `EyeOff` | Password visibility | Tabler |
| `IconDashboard` | Dashboard nav | Tabler |
| `IconDatabase` | Businesses nav | Tabler |
| `IconListDetails` | Categories nav | Tabler |
| `IconChartBar` | Analytics nav | Tabler |
| `IconUsers` | Users nav | Tabler |
| `IconReport` | Reports nav | Tabler |
| `IconSettings` | Settings nav | Tabler |
| `IconHelp` | Help nav | Tabler |
| `IconSearch` | Search nav | Tabler |

### 8.3 Icon Sizing Convention

| Context | Size |
|---------|------|
| Inline with text | `h-4 w-4` |
| Standalone / buttons | `h-5 w-5` |
| Loading spinner | `h-8 w-8` |

---

## 9. Interaction Patterns

### 9.1 Navigation

- **Public**: Horizontal `NavigationMenu` in header with active state (`text-primary font-bold`)
- **Admin**: Collapsible sidebar (`SidebarProvider`) with icon-only mode
- **Back links**: Button with `ArrowLeft` icon using `variant="link"`

### 9.2 Search & Filter

- Combined **text search** + **category dropdown** filter
- Filters operate client-side on the Convex query result
- No pagination currently (renders all matching results)

### 9.3 Loading States

- **Full-page**: Centered text "Loading..." with `text-muted-foreground`
- **Dashboard**: Full skeleton UI mirroring final layout (cards, charts, lists)
- **Admin guard**: Card with `Loader2` spinner and contextual message

### 9.4 Toast Notifications

- Powered by **Sonner** (`sonner`)
- Success/error toasts for share actions
- Success toasts for CRUD operations

### 9.5 Forms

- **Pattern**: TanStack Form + Zod schemas + Field components
- **Validation**: Real-time `onChange` + `onSubmit`
- **Error display**: `FieldError` below each field
- **Submit**: Disabled state with loading text ("Please wait...")

---

## 10. Internationalization (i18n)

### 10.1 Supported Languages

| Code | Language | File |
|------|----------|------|
| `en` | English | `messages/en.json` |
| `fil` | Filipino (Tagalog) | `messages/fil.json` |

### 10.2 Implementation

- **Context-based**: `I18nProvider` with React Context
- **Language toggle**: `Select` component in header
- **Business content**: Bilingual `name` and `description` fields (English/Tagalog)
- **Translation keys**: Flat JSON structure (e.g., `"category.restaurants"`, `"searchPlaceholder"`)

### 10.3 Naming Convention

```
"[section].[element]"  →  "category.restaurants"
"[element]"            →  "searchPlaceholder"
```

---

## 11. Data Model

### 11.1 Core Entities

#### Business
```
┌─────────────────────────────────────────────┐
│  businesses                                  │
├─────────────────────────────────────────────┤
│  name: string | { english, tagalog }         │
│  description: string | { english, tagalog }  │
│  category: { primary, secondary[] }          │
│  contact: { phone, email?, website? }        │
│  address: { street, barangay, coordinates }  │
│  operatingHours: { mon..sun: {open,close} }  │
│  photos?: [{ url, alt, isPrimary }]          │
│  metadata: {                                 │
│    dateAdded, lastUpdated, isVerified,        │
│    status: "active"|"inactive"|"pending"     │
│  }                                           │
└─────────────────────────────────────────────┘
```

#### User
```
┌─────────────────────────────────────────────┐
│  users                                       │
├─────────────────────────────────────────────┤
│  name?, email, image?, isAdmin?              │
│  emailVerificationTime?, phone?              │
└─────────────────────────────────────────────┘
```

### 11.2 Business Categories

| Category ID | English | 
|-------------|---------|
| `restaurants` | Restaurants |
| `lodging` | Lodging |
| `transportation` | Transportation |
| `tourism` | Tourism |
| `healthcare` | Healthcare |
| `retail` | Retail |
| `technology` | Technology |
| `food` | Food |
| `hardware` | Hardware |
| `bakery` | Bakery |
| `services` | Services |

### 11.3 Business Status Flow

```
pending  →  active  →  inactive
   ↑                      │
   └──────────────────────┘
```

---

## 12. Responsive Breakpoints

Uses Tailwind CSS 4 default breakpoints:

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile (portrait) |
| `sm:` | 640px | Mobile (landscape) / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |

### Key Responsive Behaviors

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Business grid | 1 column | 2 columns | 3 columns |
| Header nav | Stacked | Stacked with row | Single row |
| Auth form | Single column | Two columns (form + image) | Two columns |
| Footer | Stacked centered | 2 columns | 3 columns |
| Admin sidebar | Off-canvas | Collapsed (icon) | Expanded |
| Search bar | Stacked | Inline (search + category) | Inline |

---

## 13. Motion & Transitions

| Element | Effect | Duration |
|---------|--------|----------|
| Business cards | `hover:shadow-lg transition-shadow` | Default (150ms) |
| Logo | `group-hover:scale-105 transition-transform` | Default |
| Photo gallery selection | `border-2 transition-colors` | Default |
| Theme toggle | `transition-colors` | Default |
| Loading spinner | `animate-spin` | Continuous |

> **Guideline**: Keep transitions subtle. Use Tailwind's default `transition-*` utilities. Disable transitions on theme change via `disableTransitionOnChange` prop on `ThemeProvider`.

---

## 14. Accessibility Checklist

- [x] All form inputs have associated labels (`FieldLabel`)
- [x] Focus-visible rings on buttons, inputs, badges (`focus-visible:ring-[3px]`)
- [x] `aria-label` on icon-only buttons (theme toggle, share)
- [x] `sr-only` text for social login buttons
- [x] Semantic HTML: `header`, `main`, `footer`, `section`, `nav`
- [x] Skip-to-content consideration (not yet implemented)
- [x] Color contrast via oklch perceptual uniformity
- [x] `suppressHydrationWarning` on `<html>` for theme flicker prevention
- [ ] **TODO**: Add skip-to-content link
- [ ] **TODO**: Add ARIA landmarks on admin sidebar
- [ ] **TODO**: Keyboard navigation for business card grid

---

## 15. File & Naming Conventions

### 15.1 File Structure

| Type | Path | Convention |
|------|------|------------|
| Pages | `src/app/(group)/route/page.tsx` | Next.js App Router |
| Layouts | `src/app/(group)/layout.tsx` | Route group layouts |
| UI primitives | `src/components/ui/*.tsx` | shadcn/ui components |
| Feature components | `src/components/*.tsx` | kebab-case filenames |
| Hooks | `src/hooks/use-*.ts` | `use-` prefix, kebab-case |
| Schemas | `src/lib/schemas/*.ts` | Domain-grouped (auth, business, common) |
| Translations | `messages/*.json` | Language code filenames |
| Backend | `convex/*.ts` | Convex function modules |

### 15.2 Component Naming

| Convention | Example |
|------------|---------|
| **PascalCase** for component exports | `BusinessCard`, `AdminGuard`, `ThemeToggle` |
| **kebab-case** for ALL filenames | `business-card.tsx`, `admin-guard.tsx`, `theme-toggle.tsx` |
| **camelCase** for functions/hooks | `useConvexError`, `formatZodErrors` |
| **SCREAMING_SNAKE** for constants | `LANGUAGES` |

### 15.3 Validation Schema Naming

```typescript
// Field-level:     [field]Schema         → emailSchema, phoneSchema
// Object-level:    [domain]Schema        → loginSchema, addressSchema  
// Type exports:    [Domain]FormData      → LoginFormData, BusinessFormData
```

---

## 16. Status Indicators

| Status | Color | Badge/Icon | Hex |
|--------|-------|------------|-----|
| **Active** | Green | `CheckCircle` | `#22c55e` |
| **Pending** | Amber | `Clock` | `#f59e0b` |
| **Inactive** | Red | `XCircle` | `#ef4444` |
| **Verified** | Primary | `CheckCircle` + Badge | system primary |
| **Featured** | Gold | `Badge bg-yellow-500` | `#eab308` |

---

## 17. Error Handling Patterns

| Error Type | UI Pattern |
|------------|------------|
| **Form validation** | Inline `FieldError` below input |
| **Auth failure** | Red text below form `text-destructive` |
| **Not found** | Centered card with message + CTA |
| **No results** | Centered `text-muted-foreground text-lg` |
| **Loading** | Skeleton UI or centered spinner |
| **401 (not auth)** | Redirect to `/login` |
| **403 (not admin)** | Card with `AlertCircle` + redirect |

---

## 18. Shadow & Elevation

| Level | Class | Usage |
|-------|-------|-------|
| **Level 0** | none | Flat surfaces |
| **Level 1** | `shadow-sm` | Cards, header |
| **Level 2** | `shadow-lg` | Hovered business cards |
| **Level 3** | `shadow-xs` | Outline buttons |

---

## 19. Component Token Map

Quick reference for which tokens map to which component areas:

```
┌─ Page ─────────────── bg-background, text-foreground
│ ┌─ Header ──────────── bg-card, shadow-sm, border-b, z-50
│ │ ├─ Brand ──────────── text-foreground, hover:text-primary
│ │ └─ NavLink ────────── text-primary font-bold (active)
│ ├─ Hero ─────────────── bg-primary → bg-primary/80 (gradient)
│ │ └─ SearchInput ────── bg-card, border-border, text-foreground
│ ├─ BusinessCard ─────── bg-background, border, rounded-xl
│ │ ├─ Image ──────────── bg-card (placeholder)
│ │ ├─ Category ───────── badge secondary
│ │ └─ CTA ────────────── button default + button outline
│ ├─ EmptyState ───────── text-muted-foreground text-lg
│ └─ Footer ───────────── bg-background, border-t, text-muted-foreground
│
├─ Auth ───────────────── bg-muted (full page)
│ └─ Card ─────────────── 2-col grid, form + image
│
└─ Admin ──────────────── SidebarProvider + SidebarInset
  ├─ Sidebar ──────────── bg-sidebar, sidebar-foreground
  ├─ StatCard ─────────── bg-card, shadow-sm
  └─ DataTable ────────── bg-background, striped rows
```

---

## 20. Future Recommendations

| Area | Recommendation |
|------|----------------|
| **Brand Color** | Adopt a chromatic primary color reflecting Gloria's identity |
| **Logo** | Current `logo.png` — consider SVG for crisp rendering at all sizes |
| **Mobile Navigation** | Add hamburger menu / sheet drawer for public nav on small screens |
| **Pagination** | Add pagination or infinite scroll for business listings |
| **Map View** | Add map-based business browsing using coordinates data |
| **Image Management** | Replace placeholder images with Convex file storage |
| **Skip Navigation** | Add skip-to-content link for accessibility |
| **Animation Library** | Consider Framer Motion for page transitions |
| **Design Tokens Export** | Generate Figma-compatible tokens from CSS variables |
| **Component Documentation** | Add Storybook for interactive component library |

---

*This design system is a living document. Update it as the project evolves.*
