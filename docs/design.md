---
title: Design Philosophy & UI/UX Guidelines
version: 1.0
status: draft
---

# Design Philosophy & UI/UX Guidelines

## Overview

The Rehearsal Availability Scheduler is designed with extreme simplicity and usability in mind. The app should feel effortless to use, especially on mobile devices where most participants will access it via WhatsApp links.

## Design Principles

### 1. **Simplicity First**
- No authentication barriers
- No user accounts or permissions
- Minimal clicks to complete any action
- Clear, obvious next steps

### 2. **Mobile-First**
- Large, touch-friendly interactive elements
- Optimized for one-handed use
- Works perfectly on small screens
- Fast loading times

### 3. **Clean & Modern**
- Inspired by Linear and Notion aesthetics
- Generous whitespace
- Soft shadows and rounded corners
- Subtle, professional color palette

### 4. **Accessible**
- High contrast text
- Clear visual hierarchy
- Descriptive labels
- Works without JavaScript where possible

## Visual Design System

### Color Palette

```
Primary: #3b82f6 (Blue 500)
Success: #10b981 (Green 500)
Warning: #f59e0b (Amber 500)
Error: #ef4444 (Red 500)

Background: #ffffff (White)
Surface: #f9fafb (Gray 50)
Border: #e5e7eb (Gray 200)

Text Primary: #111827 (Gray 900)
Text Secondary: #6b7280 (Gray 500)
```

### Typography

```
Headings: System font stack (SF Pro on iOS, Roboto on Android)
Body: System font stack
Size scale: 14px (body), 16px (large), 20px (h3), 24px (h2), 32px (h1)
Line height: 1.5 for body, 1.2 for headings
```

### Spacing Scale

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Components

#### Cards
- Background: White
- Border: 1px solid Gray 200
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px (mobile), 24px (desktop)

#### Buttons
- Primary: Blue background, white text
- Secondary: White background, gray border, gray text
- Height: 44px minimum (touch-friendly)
- Border radius: 8px
- Font weight: 500

#### Checkboxes
- Size: 24px × 24px minimum
- Border: 2px solid
- Border radius: 6px
- Active state: Blue background with checkmark

#### Input Fields
- Height: 44px minimum
- Border: 1px solid Gray 300
- Border radius: 8px
- Focus: Blue border, subtle shadow
- Padding: 12px

## Page-Specific Design

### Submission Page (/)

**Layout:**
- Full-width on mobile
- Max-width 600px on desktop, centered
- Vertical stack layout

**Elements:**
1. **Header**
   - App title
   - Brief instruction text
   
2. **Name Input**
   - Large, prominent input field
   - Placeholder: "Your name"
   - Auto-focus on page load

3. **Slot Selection**
   - Each slot as a card with checkbox
   - Date and time prominently displayed
   - Calculated end time shown
   - Easy tap target (entire card clickable)

4. **Submit Button**
   - Fixed to bottom on mobile
   - Full-width
   - Disabled state when name empty

**Success State:**
- Green checkmark icon
- Success message
- Option to submit another response

### Config Page (/config)

**Layout:**
- Two-column on desktop
- Single column on mobile
- Left: Add new slot form
- Right: List of existing slots

**Elements:**
1. **Add Slot Form**
   - Date picker (native HTML5)
   - Time picker (native HTML5)
   - Duration input (number with minutes label)
   - Add button

2. **Slot List**
   - Chronologically sorted
   - Each slot in a card
   - Delete button (red, icon-only)
   - Empty state message

**Actions:**
- Delete confirmation (simple confirm dialog)
- Optional: "Delete all" with strong confirmation

### Analysis Page (/analysis)

**Layout:**
- Full-width cards
- Max-width 800px on desktop

**Elements:**
1. **Header**
   - Page title
   - Total submissions count

2. **Slot Cards**
   - Sorted by attendee count (descending), then by date
   - Visual ranking indicator for top 3
   - Attendee count badge
   - Date and time
   - Expandable attendee list

**Visual Indicators:**
- 🏆 Trophy icon for #1 slot
- Green highlight for top 3 slots
- Percentage bar showing attendance rate

**Attendee List:**
- Collapsed by default (show count)
- Click to expand
- Names in alphabetical order
- Comma-separated or list format

## Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

## Interactions & Animations

### Micro-interactions
- Button hover: Slight darkening
- Card hover: Subtle lift (2px translate)
- Checkbox: Scale animation on check
- Page transitions: Fade in (200ms)

### Loading States
- Skeleton screens for data loading
- Spinner for form submissions
- Optimistic UI updates where possible

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly labels
- Focus visible indicators
- Sufficient color contrast (4.5:1 minimum)

## Mobile Considerations

### Touch Targets
- Minimum 44px × 44px
- Generous spacing between interactive elements
- No hover-dependent functionality

### Performance
- Lazy load images (if any)
- Minimize JavaScript bundle
- Server-side rendering for initial paint
- Optimize for 3G networks

### PWA Features (Optional)
- Add to home screen capability
- Offline-first approach
- Service worker for caching

## Dark Mode (Optional Enhancement)

If implemented:
- System preference detection
- Toggle in header
- Inverted color palette
- Reduced contrast for comfort

## Error States

### Form Validation
- Inline error messages
- Red border on invalid fields
- Clear error text below field

### Network Errors
- Toast notification
- Retry button
- Graceful degradation

### Empty States
- Friendly illustration or icon
- Helpful message
- Clear call-to-action

## Success Metrics

Design success measured by:
- Time to complete submission < 30 seconds
- Mobile bounce rate < 20%
- Zero accessibility violations
- Positive user feedback

---

**Next Steps:**
Review and approve this design document before proceeding to implementation.
