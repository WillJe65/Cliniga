# Cliniga Design Guidelines

## Design Approach
**Medical Trust & Professionalism**: Drawing inspiration from leading healthcare platforms like Zocdoc, One Medical, and modern SaaS dashboards (Linear, Notion) to balance clinical professionalism with approachable, user-friendly interfaces.

## Core Design Principles
1. **Trust & Credibility**: Clean, spacious layouts that instill confidence
2. **Clarity Over Complexity**: Information hierarchy that prioritizes patient/doctor needs
3. **Accessibility First**: High contrast, readable typography, clear interactive states

## Typography System
- **Primary Font**: Inter or DM Sans (Google Fonts) - modern, highly legible
- **Headings**: Font weights 600-700, sizes: text-3xl to text-5xl for heroes, text-xl to text-2xl for sections
- **Body Text**: Font weight 400-500, text-base for primary content, text-sm for metadata
- **UI Elements**: Font weight 500-600, text-sm to text-base

## Layout & Spacing
**Tailwind Spacing Units**: Consistently use 4, 6, 8, 12, 16, 20, 24 for padding/margins
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Card padding: p-6 to p-8
- Component spacing: gap-4 to gap-8 in grids
- Container: max-w-7xl for full sections, max-w-4xl for content-focused areas

## Component Library

### Navigation
- **Public Header**: Transparent/white background, sticky positioning, logo left, menu right (Home, Doctors, Login, Register)
- **Authenticated Header**: Role-specific navigation with user avatar dropdown, clear "Book Appointment" CTA for patients

### Cards & Containers
- **Doctor Cards**: Shadow-sm, rounded-xl, border border-gray-200, hover:shadow-md transition
- **Appointment Cards**: Status badge (top-right), patient/doctor info, date/time prominent, action buttons aligned right
- **Dashboard Widgets**: Subtle background (bg-gray-50), rounded-lg, organized in 2-3 column grid on desktop

### Forms & Inputs
- **Input Fields**: Rounded-lg, border-gray-300, focus:ring-2 focus:ring-blue-500, py-3 px-4
- **Buttons Primary**: bg-blue-600 text-white, rounded-lg, px-6 py-3, hover:bg-blue-700
- **Buttons Secondary**: border-2 border-gray-300, text-gray-700, rounded-lg, hover:border-gray-400
- **Select Dropdowns**: Match input styling, include chevron icon

### Status Badges
- **Confirmed**: bg-green-100 text-green-800
- **Pending**: bg-yellow-100 text-yellow-800
- **Completed**: bg-gray-100 text-gray-700
- **Cancelled**: bg-red-100 text-red-800
- Shape: rounded-full, px-3 py-1, text-xs font-medium

### Modals & Overlays
- **Modal Background**: bg-white, rounded-xl, shadow-2xl, max-w-2xl
- **Backdrop**: bg-black/50, backdrop-blur-sm
- **Medical Records Form**: Clean text areas, labeled sections for Diagnosis and Notes

## Page-Specific Layouts

### Landing Page (/)
- **Hero Section**: Full-width (h-screen or min-h-[600px]), centered content with headline, subheadline, dual CTAs ("Book Appointment" + "Find Doctors")
- **Trust Indicators**: Stats section (3-4 columns) showing "500+ Doctors", "10,000+ Appointments", etc.
- **How It Works**: 3-step process cards with icons
- **Featured Doctors**: 3-column grid preview with "View All Doctors" CTA
- **Footer**: Multi-column with links, contact info, social media

### Doctors Listing (/doctors)
- **Grid Layout**: 3 columns (lg), 2 columns (md), 1 column (sm)
- **Filter Sidebar**: Left sidebar (desktop) or collapsible drawer (mobile) with specialization filters
- **Doctor Cards Include**: Profile photo placeholder, name (text-xl font-semibold), specialization badge, schedule summary, "Book Appointment" button

### Login/Register Pages
- **Centered Layout**: max-w-md, card-style form on clean background
- **Role Selector** (Login): Toggle buttons for Patient/Doctor selection (prominent, mutually exclusive)
- **Form Fields**: Email, password, role toggle, submit button full-width

### Patient Dashboard
- **Two-Column Layout**: Upcoming appointments (larger column), Quick actions sidebar
- **Appointment List**: Chronological, each showing doctor name, specialization, date/time, status badge
- **Empty State**: Friendly illustration placeholder with "Book Your First Appointment" CTA

### Doctor Dashboard
- **Today's Schedule**: Timeline/list view showing appointments by time slot
- **Appointment Details**: Click to expand or open modal with patient info and medical records form
- **Medical Records Form**: Large text areas with clear labels, save button

### Booking Flow (/book-appointment)
- **Multi-Step Progress**: Step indicator at top (Select Doctor → Choose Date/Time → Confirm)
- **Doctor Selection**: Grid of available doctors with radio selection
- **Date Picker**: Calendar component (large touch targets)
- **Time Slots**: Grid of available times as selectable buttons
- **Confirmation Summary**: Review card before final submission

## Images

### Hero Image
Large background image (hero section): Professional healthcare setting - modern clinic reception area or doctor consulting with patient. Image should be bright, welcoming, with slight overlay (bg-gradient-to-r from-blue-600/90 to-blue-800/80) to ensure text readability.

### Doctor Profile Images
Circular placeholder images (w-24 h-24) for doctor cards - use professional headshot style placeholders with initials fallback.

### Illustrations
Empty state illustrations for dashboards when no appointments exist - friendly, minimal healthcare-themed illustrations.

## Responsive Behavior
- **Breakpoints**: Mobile-first approach (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Navigation**: Hamburger menu below md breakpoint
- **Grids**: Stack to single column on mobile, 2-3 columns on desktop
- **Modals**: Full-screen on mobile (rounded-none), centered card on desktop