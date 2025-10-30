# LogiTrack Logistics Management System - Design Guidelines

## Design Approach
**Hybrid Approach**: Marketing landing page with visual appeal + Utility-focused dashboard system combining Notion's clean information architecture with Linear's refined typography and Stripe's balanced restraint.

## Core Design Principles
1. **Trust & Professionalism**: Logistics requires reliability - design communicates security and competence
2. **Efficiency First**: Dashboard interfaces prioritize speed and clarity over decoration
3. **Progressive Disclosure**: Complex features revealed contextually to avoid overwhelming users
4. **Real-time Visibility**: Live tracking and status updates are central to the experience

## Typography System

**Font Stack**: Inter (primary), system-ui fallback
- **Hero/Display**: 48px-56px, weight 700, line-height 1.1
- **Page Headers**: 28px-32px, weight 700, tight letter-spacing
- **Section Headers**: 20px-24px, weight 600
- **Body Large**: 16px-18px, weight 400, line-height 1.6
- **Body**: 14px-15px, weight 400, line-height 1.5
- **Small/Meta**: 12px-13px, weight 500, reduced opacity (0.85)

## Layout System

**Spacing Scale**: Use Tailwind units consistently
- **Primary rhythm**: 4, 8, 12, 16, 20, 24, 32 (p-4, gap-8, mb-12, etc.)
- **Large sections**: 48, 64, 80 for major vertical spacing
- **Micro-spacing**: 2, 3 for tight element groupings

**Container Widths**:
- Landing page: max-w-7xl (1280px)
- Dashboard content: max-w-6xl (1152px)
- Forms/modals: max-w-2xl (672px)
- Text content: max-w-prose (65ch)

**Grid Patterns**:
- Feature grids: 3 columns desktop, 2 tablet, 1 mobile
- Dashboard cards: 2-column layout with flexible sizing
- Data tables: Full-width with horizontal scroll on mobile

## Component Library

### Navigation
- **Landing**: Fixed transparent nav with blur backdrop, transitions to solid on scroll, height 72px
- **Dashboard**: Persistent top bar with breadcrumbs, user profile, height 64px
- **Mobile**: Hamburger menu with slide-in drawer

### Cards & Containers
- **Glass morphism panels**: rgba(255,255,255,0.1) background, blur(10px), 12-16px border-radius
- **Elevated cards**: White backgrounds for dashboard, subtle shadow (0 8px 24px rgba(0,0,0,0.08))
- **Hover states**: translateY(-2px) with enhanced shadow
- **Interactive cards**: Smooth 0.3s transitions on all state changes

### Buttons
**Primary**: Gradient (linear-gradient(135deg, #1e3c72, #2a5298)), white text, 10-12px padding, rounded-lg, font-weight 600
**Secondary**: rgba(255,255,255,0.15) background, white text with subtle border
**Ghost**: Transparent with border, hover increases opacity
**On Images**: Background blur(8px) with rgba overlay, no color-based hover (rely on transform only)

### Forms
- Input height: 44-48px for touch targets
- Border: 2px solid with transition to brand color on focus
- Focus rings: 0 0 0 3px rgba(brand, 0.1) for accessibility
- Labels: Above inputs, 14px, weight 600
- Validation: Inline error messages, red accent, appears with fade-in
- Dropdowns: Consistent height, readable text contrast

### Status Indicators
- **Pending**: Warm yellow background (#fef9c3), dark text
- **In Transit**: Blue background (#dbeafe), dark blue text
- **Delivered**: Green background (#dcfce7), dark green text
- **Delayed/Alert**: Red background (#fee2e2), dark red text
- Pill-shaped badges: 4-6px vertical padding, 10-12px horizontal, border-radius full

### Maps & Tracking
- **Map container**: 450px height desktop, 300px mobile, rounded-lg overflow
- **Vehicle markers**: Custom icons (Font Awesome trucks), 24px size, color-coded
- **Routes**: Dashed polylines, brand color, 2px stroke
- **Popups**: White background, brand header, compact information display

### Modals & Overlays
- **Backdrop**: rgba(0,0,0,0.6) with backdrop blur
- **Modal**: White background, 32px padding, max-width 600px, rounded-xl
- **Animation**: fadeIn 0.3s ease with slight translateY
- **Close**: Top-right X button, accessible keyboard support

### Tables
- **Header**: Light background (#f8fafc), uppercase 13px text, sticky on scroll
- **Rows**: Alternating subtle backgrounds, hover state with slight darkening
- **Cell padding**: 12px vertical, 16px horizontal
- **Actions column**: Right-aligned, compact icon buttons
- **Mobile**: Stack rows as cards or horizontal scroll

## Landing Page Specific Design

### Hero Section
- **Layout**: Two-column (60/40 split), text left, visual right
- **Height**: 80vh minimum, allows scroll to discover more
- **Background**: Full-page gradient (135deg, #1e3c72 → #2a5298 → #638cd7) with animated SVG path overlay showing delivery routes
- **Image**: Right side shows warehouse logistics scene or delivery dashboard screenshot, rounded-lg, subtle shadow
- **Badge**: "Live Tracking • M-Pesa Enabled" with pulsing indicator, glass morphism style
- **CTA Buttons**: Two buttons (primary "Get Started", secondary "Watch Demo"), generous 48px height

### Features Section
- **Grid**: 3 cards with icon, heading, description
- **Icons**: 56px emoji or Font Awesome in circular backgrounds with brand gradient
- **Card design**: White elevated cards with hover lift effect
- **Background**: Subtle animated SVG paths showing delivery routes (low opacity)

### How It Works Section
- **Layout**: 3-column grid for user types (Shippers, Dispatchers, Drivers)
- **Visual hierarchy**: Icon → Role title → Step-by-step list
- **Cards**: Glass morphism on gradient background

### Testimonials Section
- **Layout**: 2-column grid
- **Style**: Dark gradient cards with light text, contrasting with other sections
- **Content**: Quote, name, role, company

### Contact/CTA Section
- **Layout**: Centered or 2-column (form + info)
- **Form**: Single column, generous spacing, clear labels
- **Background**: Subtle pattern or gradient shift

### Footer
- **Background**: Deep navy (#07112a)
- **Content**: Multi-column layout with links, contact info, social icons
- **Height**: Auto, comfortable padding

## Images Specification

### Hero Image
**Placement**: Right side of hero section, 480px width desktop
**Description**: Modern logistics warehouse interior with organized parcels on conveyor belts, or a clean dashboard interface mockup showing tracking screens. Professional, bright, organized aesthetic. Use stock photo from Unsplash or Pexels (logistics/warehouse category).

### Feature Section Illustrations
**Placement**: Above each feature card (optional) or as background elements
**Description**: Iconographic illustrations of tracking maps, delivery trucks, analytics dashboards - minimal, line-art style in brand colors

### Testimonial Avatars
**Placement**: Small circular images next to testimonials
**Description**: Professional headshots or initials in colored circles (40-48px diameter)

### No large images needed for**: Dashboard pages (maps are functional, not decorative)

## Dashboard Pages Design

### Admin Dashboard
- **Layout**: Header + Quick action cards (4 across) + Map/Alerts split (70/30)
- **Quick actions**: Glass morphism cards with icon, title, subtitle, hover lift
- **Map**: Leaflet integration, full-featured with controls
- **Alerts**: Scrollable sidebar, icon + message format

### Client Portal
- **Layout**: Collapsible sections (accordion pattern)
- **Sections**: Create Shipment, My Requests, Track Shipment, each with expand/collapse
- **Request cards**: White background, status badge, metadata, options menu

### Shipment Management
- **Layout**: Filters bar + data table + modals
- **Table**: Full-featured with search, status filter, sorting
- **Actions**: Icon buttons (edit, delete) in last column

### Personnel Management
- **Layout**: Table + Calendar view toggle
- **Calendar**: 7-column grid, day cells with shift assignments
- **Shift indicators**: Small colored pills within date cells

## Animations (Minimal Usage)

- **Page transitions**: None or subtle fade
- **Card hovers**: translateY(-2px) with shadow enhancement
- **Button interactions**: Subtle scale or shadow on hover/active
- **Modal entrance**: fadeIn with translateY
- **Loading states**: Spinner or skeleton screens
- **Live elements**: Subtle pulse on tracking indicators only

## Accessibility

- Focus indicators: 3px solid outline with brand color
- Color contrast: WCAG AA minimum (4.5:1 for body text)
- Interactive elements: Minimum 44×44px touch targets
- Alt text: Descriptive for all images
- Keyboard navigation: Full support across all interactive elements
- Form labels: Always visible, never placeholder-only

## Responsive Breakpoints

- Mobile: 0-640px (single column, stacked navigation)
- Tablet: 641-1024px (2-column grids, condensed spacing)
- Desktop: 1025px+ (full multi-column layouts, optimal spacing)

## Color Usage Notes

Per guidelines: No specific color specifications in this document. Color palette applied during implementation maintains brand gradient (blues) with semantic colors for status states only.