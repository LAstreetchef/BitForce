# Design Guidelines: Brand Ambassador Lead Management Portal

## Design Approach

**Selected System**: Shadcn + Linear/Notion Inspiration
Modern productivity app aesthetic with clean data density and subtle gamification elements. Focus on information hierarchy and efficient workflows while maintaining visual polish through shadcn's component library.

## Core Design Elements

### Typography
- **Headings**: Inter Bold - text-2xl for page titles, text-xl for section headers, text-lg for card titles
- **Body**: Inter Regular - text-base for content, text-sm for table cells and metadata
- **Stats/Numbers**: Inter SemiBold - text-3xl for point totals, text-xl for leaderboard ranks

### Layout System
Primary spacing units: **2, 4, 6, 8, 12** (tailwind units)
- Container padding: px-6 py-8 on desktop, px-4 py-6 on mobile
- Card spacing: p-6 for large cards, p-4 for compact cards
- Grid gaps: gap-6 for primary layouts, gap-4 for dense data
- Section spacing: mb-8 between major sections

### Component Library

**Dashboard Structure**:
- Top Navigation Bar: Full-width header with logo, search, notifications bell, user avatar (h-16, sticky)
- Sidebar Navigation: Fixed left sidebar (w-64) with icon+label nav items, collapsible on mobile
- Main Content: Three-column stats row at top (grid-cols-3), followed by dual-column layout (grid-cols-2) for leaderboard + recent activity

**Gamification Widgets**:
- Points Display Card: Large centered number with animated progress ring, smaller trend indicator (+124 this week)
- Leaderboard: Ranked list with avatar, name, points, position badge (top 3 get special treatment - gold/silver/bronze accents)
- Achievement Badges: Horizontal scrolling row of circular badge icons with tooltips
- Progress Bars: Multi-stage progress indicators for monthly goals

**Lead Management Components**:
- Lead Table: Sortable columns (Name, Company, Service, Status, Assigned Date, Last Contact), row hover states, inline status badges
- Status Pills: Rounded full badges with dot indicators (New: blue dot, In Progress: orange, Converted: green, Lost: gray)
- Quick Actions Menu: Three-dot dropdown with "Edit", "Assign Service", "Add Note", "Mark Complete"
- Filter Bar: Horizontal row with dropdown filters (Status, Service Type, Date Range) + search input

**Service Assignment Interface**:
- Service Cards: Grid display (grid-cols-3) with service icon, name, description, "Assign" button
- Assignment Modal: Overlay with service details, lead selection dropdown, notes textarea, confirm button

**Status Tracking**:
- Timeline View: Vertical timeline with status change history, timestamps, assignee avatars
- Follow-up Queue: Kanban-style columns (Today, This Week, Later) with draggable lead cards
- Activity Feed: Reverse chronological list with icons for different actions (call, email, meeting, status change)

**Data Visualization**:
- Conversion Funnel: Horizontal stacked bar showing lead progression
- Monthly Metrics: Line chart for leads over time with shadcn chart components
- Performance Cards: Grid of metric cards (Conversion Rate %, Avg Response Time, Active Leads)

### Form Elements
All inputs use shadcn defaults: rounded-md borders, focus rings, proper labels above fields
- Text inputs: h-10 with px-3 padding
- Dropdowns: Chevron icon, smooth open animations
- Textareas: min-h-24 for notes fields
- Buttons: Primary (corporate blue), Secondary (outline), Destructive (red) variants

### Navigation Patterns
- Primary Nav: Fixed sidebar with Dashboard, Leads, Services, Reports, Settings
- Breadcrumbs: Show hierarchy on detail pages (Dashboard > Leads > Lead Name)
- Tab Navigation: Within detail pages for different views (Overview, Activity, Notes)

### Images Section
**No traditional hero image** - this is an authenticated portal.

**Profile/Avatar Images**:
- User avatars throughout: 32px circular in nav, 40px in leaderboard, 24px in activity feed
- Placeholder avatars use initials on colored backgrounds when no photo

**Service Icons**:
- Each service type gets consistent iconography (use Lucide icons via shadcn)
- Display at 48px in service assignment cards

**Empty States**:
- Illustration for empty lead list (simple line art of clipboard/checklist)
- Illustration for no activity (calendar with checkmark)

### Responsive Behavior
- Desktop (lg): Full sidebar + three-column stats + dual-column content
- Tablet (md): Collapsed sidebar (icons only) + two-column stats + single-column content
- Mobile: Hidden sidebar (hamburger menu) + single-column everything, sticky filter bar

### Micro-interactions
- Smooth transitions on hover states (transition-colors duration-200)
- Success toast notifications for actions (top-right, auto-dismiss)
- Loading skeletons for table data fetches
- Optimistic updates for status changes