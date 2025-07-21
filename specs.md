# Gloria Local Connect - Technical Specification

**Version:** 1.0  
**Date:** July 20, 2025  
**Author:** Leodyver S. Semilla  
**Project:** Bachelor of Science in Information Technology Capstone

## 1. Executive Summary

Gloria Local Connect is a mobile-first web application that serves as a comprehensive directory of services and businesses within the Municipality of Gloria, Oriental Mindoro, Philippines. The application aims to bridge the information gap for residents and tourists seeking local business information.

## 2. Project Overview

### 2.1 Problem Statement

- Residents and visitors lack centralized access to reliable local business information
- Current methods (word-of-mouth, outdated directories, fragmented social media) are inefficient
- Local SMEs have limited digital visibility
- Tourist experience is hindered by lack of accessible service information

### 2.2 Solution Overview

A mobile-first web application providing a searchable directory of local businesses with integrated mapping, multilingual support, and regular updates.

### 2.3 Target Audience

- **Primary:** 50,496 residents of Gloria (2020 Census)
- **Secondary:** Tourists visiting attractions (Walang Langit Falls, Agsalin Sanctuary, Phantom Cave)
- **Tertiary:** Local business owners seeking visibility

## 3. System Requirements

### 3.1 Functional Requirements

#### 3.1.1 Core Features

- **FR-001:** Business Directory Display

  - System shall display business listings with name, address, phone, category, description, hours, and photos
  - System shall support categorized browsing
  - System shall provide search functionality by business name and category

- **FR-002:** Search and Filter

  - System shall provide real-time search with autocomplete suggestions
  - System shall support filtering by business category
  - System shall support search in both English and Tagalog languages

- **FR-003:** Map Integration

  - System shall integrate with Google Maps API
  - System shall display business locations on interactive maps
  - System shall provide navigation directions to selected businesses

- **FR-004:** Multilingual Support
  - System shall support English and Tagalog languages
  - System shall allow language switching via UI toggle
  - System shall maintain search functionality in both languages

#### 3.1.2 Business Management

- **FR-005:** Business Information Management
  - System shall allow addition of new business listings
  - System shall support updating existing business information
  - System shall validate business information completeness

#### 3.1.3 User Analytics

- **FR-006:** Usage Tracking
  - System shall track unique user visits
  - System shall track search queries and popular businesses
  - System shall generate basic analytics reports

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

- **NFR-001:** Page load time shall not exceed 3 seconds on 3G connection
- **NFR-002:** Search results shall appear within 2 seconds of query submission
- **NFR-003:** Application shall support concurrent access by up to 100 users

#### 3.2.2 Usability

- **NFR-004:** Application shall be responsive on devices with screen sizes from 320px to 1920px
- **NFR-005:** Application shall be accessible without app installation
- **NFR-006:** User interface shall be intuitive for users with basic digital literacy

#### 3.2.3 Compatibility

- **NFR-007:** Application shall work on mobile browsers (Chrome, Safari, Firefox, Edge)
- **NFR-008:** Application shall be compatible with Android 5.0+ and iOS 12.0+
- **NFR-009:** Application shall function on connections as slow as 2G

#### 3.2.4 Reliability

- **NFR-010:** System uptime shall be minimum 95%
- **NFR-011:** Data shall be backed up daily
- **NFR-012:** System shall gracefully handle network disconnections

## 4. Technical Architecture

### 4.1 Technology Stack Options

#### Technology Stack (2025)

- **Frontend:** Next.js (React 19+), TypeScript, Tailwind CSS v4, App Router, React Server Components
- **Backend:** Convex (authentication, database, storage)
- **Styling:** Tailwind CSS v4, with utility-first and @apply for reusable styles
- **APIs:** Google Maps JavaScript API, Google Places API, Geocoding API
- **Hosting/Deployment:** Vercel (preferred for Next.js), or Netlify
- **Tooling:** ESLint, Prettier, Tailwind IntelliSense, clsx/tailwind-merge for class management
- **PWA:** Next.js built-in PWA capabilities for offline support

This stack leverages the latest Next.js features (App Router, React Server Components) for performance and scalability, with Tailwind CSS for rapid, consistent UI development. Convex provides a secure backend for business data and user management. Vercel ensures seamless deployment and optimal performance for Next.js apps.

### 4.2 System Architecture

```
┌──────────────────────────────────────────────┐
│           User Interface (Next.js)           │
│  - Mobile-First Responsive Web App           │
│  - Tailwind CSS Utility-First Styling        │
│  - App Router & React Server Components      │
└──────────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────────┐
│         Application Layer (Next.js)          │
│  - Search Logic, Filtering, Multilingual     │
│  - PWA/Offline Support                      │
│  - Data Fetching (Convex, APIs)           │
└──────────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────────┐
│           Backend (Convex)                 │
│  - Business Directory Database               │
│  - User Authentication & Analytics           │
│  - File/Photo Storage                        │
└──────────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────────┐
│         External APIs                        │
│  - Google Maps JavaScript API                │
│  - Google Places API                         │
│  - Geocoding API                             │
└──────────────────────────────────────────────┘
```

## 5. Data Specifications

### 5.1 Business Entity Schema

```json
{
  "businessId": "string (UUID)",
  "name": {
    "english": "string (required, max 100 chars)",
    "tagalog": "string (optional, max 100 chars)"
  },
  "category": {
    "primary": "string (required)",
    "secondary": "array of strings (optional)"
  },
  "contact": {
    "phone": "string (Philippine format: +63XXXXXXXXXX)",
    "email": "string (optional, valid email format)",
    "website": "string (optional, valid URL)"
  },
  "address": {
    "street": "string (required)",
    "barangay": "string (required)",
    "coordinates": {
      "latitude": "number (required)",
      "longitude": "number (required)"
    }
  },
  "description": {
    "english": "string (max 500 chars)",
    "tagalog": "string (optional, max 500 chars)"
  },
  "operatingHours": {
    "monday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "tuesday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "wednesday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "thursday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "friday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "saturday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" },
    "sunday": { "open": "HH:mm", "close": "HH:mm", "closed": "boolean" }
  },
  "photos": [
    {
      "url": "string (valid URL)",
      "alt": "string (accessibility description)",
      "isPrimary": "boolean"
    }
  ],
  "metadata": {
    "dateAdded": "ISO 8601 datetime",
    "lastUpdated": "ISO 8601 datetime",
    "isVerified": "boolean",
    "status": "active | inactive | pending"
  }
}
```

### 5.2 Business Categories

```
Primary Categories:
- Restaurants & Food
- Accommodation & Lodging
- Transportation
- Healthcare
- Retail & Shopping
- Professional Services
- Tourism & Recreation
- Government Services
- Financial Services
- Utilities & Repairs
```

## 6. User Interface Specifications

### 6.1 Mobile-First Design Principles

- **Breakpoints:**
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

### 6.2 Core User Interface Components

#### 6.2.1 Header

- Logo/App name
- Language toggle (EN/TL)
- Search bar (prominent, always visible)

#### 6.2.2 Home Screen

- Category grid (3x3 on mobile, 4x4 on tablet)
- Featured businesses carousel
- Recent searches (if any)
- Quick access to popular categories

#### 6.2.3 Search Results

- Filter options (category, distance, rating)
- List view with business cards showing:
  - Business name
  - Category
  - Address (truncated)
  - Phone number (clickable)
  - Distance from user location
  - Primary photo thumbnail

#### 6.2.4 Business Detail Page

- Photo gallery
- Complete business information
- Map with location marker
- "Get Directions" button
- Contact actions (call, message if applicable)
- Operating hours with current status

### 6.3 Navigation Patterns

- Bottom navigation bar for mobile
- Sidebar navigation for tablet/desktop
- Breadcrumb navigation for deep pages
- Back button functionality

## 7. API Specifications

### 7.1 Google Maps Integration

```javascript
// Required API endpoints
- Maps JavaScript API
- Places API (for location validation)
- Geocoding API (for address conversion)

// API Key Restrictions
- HTTP referrers: gloria-local-connect.com/*
- API restrictions: Maps JavaScript API, Places API, Geocoding API
```

### 7.2 Internal API Endpoints (if custom backend)

```
GET /api/businesses
- Returns paginated list of businesses
- Query parameters: category, search, limit, offset

GET /api/businesses/:id
- Returns detailed business information

GET /api/categories
- Returns list of available categories

POST /api/analytics/view
- Tracks business view events
- Body: {businessId, timestamp, userLocation}
```

## 8. Success Metrics & KPIs

### 8.1 Launch Targets (80 days)

- **Business Listings:** 10-20 verified businesses
- **User Adoption:** 120 unique users within 100 days
- **User Engagement:** Average session duration > 2 minutes
- **Search Success Rate:** >80% of searches return relevant results

### 8.2 Long-term Goals (6 months)

- **Business Coverage:** 50+ active listings
- **Monthly Active Users:** 500+
- **User Retention:** 30% return visitors
- **Business Inquiries:** Track contact form submissions/calls

## 9. Development Phases

### Phase 1: MVP Development (30 days)

- Basic business directory functionality
- Simple search by name/category
- Google Maps integration
- Mobile-responsive design
- English language support

### Phase 2: Enhanced Features (20 days)

- Tagalog language support
- Advanced filtering options
- Business photos support
- Analytics implementation
- Performance optimization

### Phase 3: Launch Preparation (15 days)

- User testing and feedback integration
- Content population (initial businesses)
- Marketing material preparation
- QR code generation for businesses

### Phase 4: Post-Launch (15 days)

- Bug fixes and improvements
- Additional business onboarding
- Feature enhancements based on user feedback
- Performance monitoring and optimization

## 10. Quality Assurance

### 10.1 Testing Requirements

- **Functional Testing:** All features work as specified
- **Usability Testing:** 5+ users test navigation and search
- **Performance Testing:** Load time verification on various devices
- **Cross-browser Testing:** Chrome, Safari, Firefox on mobile
- **Accessibility Testing:** Basic WCAG 2.1 compliance

### 10.2 Acceptance Criteria

- All functional requirements implemented and tested
- Page load times meet performance requirements
- Search functionality returns accurate results
- Map integration works reliably
- Language switching functions properly
- Application works offline with cached data

## 11. Risk Mitigation

### 11.1 Technical Risks

- **Internet Connectivity:** Implement progressive loading and caching
- **API Limitations:** Monitor Google Maps API usage and implement fallbacks
- **Device Compatibility:** Extensive testing across various devices

### 11.2 Business Risks

- **Data Accuracy:** Implement business verification process
- **User Adoption:** Multi-channel marketing and community engagement
- **Content Maintenance:** Establish update schedule and business partnerships

## 12. Maintenance & Support

### 12.1 Content Updates

- Monthly review of business information accuracy
- Quarterly addition of new businesses
- Ongoing photo and description updates

### 12.2 Technical Maintenance

- Weekly monitoring of application performance
- Monthly security updates and patches
- Quarterly feature updates based on user feedback

---

**Document Status:** Draft v1.0  
**Next Review:** Implementation Planning Phase  
**Approval Required:** Project Supervisor, Technical Review Committee
