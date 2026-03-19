# Planning Guide

A mobile-friendly customer feedback application for Swagath Indian Grocery in Redmond that enables customers to submit detailed product feedback with photos and allows administrators to review submissions filtered by date range.

**Experience Qualities**:
1. **Approachable**: Simple, welcoming interface that encourages customers to share honest feedback without friction
2. **Efficient**: Quick form completion optimized for mobile use with minimal typing and clear categorization
3. **Trustworthy**: Professional branding that reflects the store's identity while maintaining data integrity for administrative review

**Complexity Level**: Light Application (multiple features with basic state)
This is a dual-mode application with customer feedback submission and admin review functionality, requiring form handling, image uploads, date filtering, and persistent data storage.

## Essential Features

**Customer Feedback Submission**
- Functionality: Allows customers to submit product feedback with category, subcategory, product name, comment (up to 500 characters), and optional photos (up to 5)
- Purpose: Gather structured product feedback to improve inventory and customer satisfaction
- Trigger: Customer clicks "Submit Feedback" or accesses the main page
- Progression: Select category → Select subcategory → Enter product name → Write comment (with character counter) → Optionally upload photos → Submit → See confirmation
- Success criteria: Feedback saves to persistent storage with timestamp, all fields validate correctly, photo uploads work, character limit enforces at 500

**Category & Subcategory Selection**
- Functionality: Hierarchical dropdown system covering all grocery categories (Fruits & Vegetables, Beverages, Pantry, Flours, Meal Kits, Dairy & Eggs, Frozen, Rice & Noodles, Pulses, Health & Beauty, Household, Pooja Items, Dals, Snacks, Festival, Homestyle Food)
- Purpose: Organize feedback by product type for easier review and inventory decisions
- Trigger: User begins feedback form
- Progression: Select category from dropdown → Subcategory dropdown populates with relevant options → Continue to product details
- Success criteria: All categories and subcategories from the provided list are available, subcategories update dynamically based on category selection

**Photo Upload**
- Functionality: Upload up to 5 product photos via file input or camera on mobile devices
- Purpose: Provide visual context for feedback (quality issues, packaging problems, etc.)
- Trigger: User clicks "Add Photos" button in feedback form
- Progression: Click add photos → Select from gallery or take photo → Preview thumbnails → Remove if needed → Continue with submission
- Success criteria: Supports up to 5 images, shows previews, allows removal, stores images with feedback data

**Admin Login Authentication**
- Functionality: Secure login system requiring username and password to access admin-only features
- Purpose: Protect sensitive admin features (dashboard, QR code, settings) from unauthorized access with credentials separate from GitHub ownership
- Trigger: Owner user visits application and attempts to access admin features
- Progression: Owner detected → Admin login screen displayed → Enter username "supreme" and password "lakshmi" → Authenticate → Access admin features (or show error for invalid credentials) → Logout option available in admin view
- Success criteria: Only authenticated admins can access dashboard/QR/settings tabs, credentials validated correctly, login state persists between sessions using KV storage, logout clears access, contact email (contact@swagathhomefoods.com) shown for credential reset requests

**Admin Review Dashboard**
- Functionality: Authenticated view showing all feedback submissions with date range filtering (ADMIN ONLY - requires isOwner authentication AND admin login)
- Purpose: Enable store management to review and analyze customer feedback systematically
- Trigger: Admin successfully logs in with valid credentials
- Progression: Login → View feedback list → Apply date filters (start/end date) → Review submissions with all details and photos → Export or take action → Logout
- Success criteria: Only logged-in owners can access, displays all feedback fields including photos, date filtering works correctly, fully mobile-responsive with adaptive layouts

**QR Code Generation for Customer Access**
- Functionality: Generate downloadable QR code linking to the feedback form URL for easy customer access (ADMIN ONLY)
- Purpose: Enable customers to quickly access feedback form by scanning QR code in-store with their mobile devices
- Trigger: Authenticated admin navigates to QR Code tab in dashboard
- Progression: Login → Navigate to QR Code tab → View generated QR code → Download QR code image → Print and display in store → Customers scan code to access form
- Success criteria: QR code accurately links to feedback form, downloadable as PNG, URL copyable to clipboard, mobile-responsive display, only accessible after admin login

**Email Notifications for New Feedback**
- Functionality: Automatically send email notifications to configured admin email address when customers submit feedback (ADMIN ONLY settings)
- Purpose: Enable immediate awareness of new customer feedback without requiring constant dashboard monitoring
- Trigger: Customer submits feedback form successfully (after admin has configured email settings)
- Progression: Admin logs in → Navigate to settings tab → Enable email notifications → Enter recipient email address → Save settings → Customer submits feedback → Email notification automatically sent to configured address via mailto link
- Success criteria: Email settings persist between sessions, email validation works correctly, notifications trigger on feedback submission, email contains feedback details formatted professionally, settings only accessible after admin login

**Date Range Filtering**
- Functionality: Filter feedback submissions by start date and end date
- Purpose: Focus review on recent feedback or specific time periods
- Trigger: Admin selects date range inputs in dashboard
- Progression: Select start date → Select end date → List updates automatically → Clear filters to see all
- Success criteria: Filters apply correctly, handles edge cases (no end date, same dates, etc.), shows feedback count

## Edge Case Handling

- **Empty States**: Display welcoming message when no feedback exists, guide users to submit first feedback
- **Image Upload Failures**: Show error message if upload fails, allow retry, don't block submission if images fail
- **Long Product Names**: Truncate display but show full text on hover/expand
- **Missing Required Fields**: Highlight empty required fields with clear error messages before submission
- **Unauthorized Access**: Show admin login screen for owners attempting to access admin features; redirect non-owners to customer feedback form
- **Invalid Login Credentials**: Display clear error message for incorrect username/password, provide contact email for credential reset
- **Character Limit Exceeded**: Disable submission, show red counter when approaching/exceeding 500 characters
- **Invalid Date Ranges**: Alert if end date is before start date, auto-correct or prevent invalid selection
- **No Results**: Show "No feedback found" message when date filters return empty results
- **Invalid Email Configuration**: Validate email format before saving settings, prevent enabling notifications without valid email
- **Email Notification Failures**: Silently handle email failures without blocking feedback submission, log errors for debugging
- **Persistent Login State**: Login status persists across page refreshes, logout button always visible in admin view

## Design Direction

The design should evoke warmth, authenticity, and cultural richness reflecting Indian heritage while maintaining modern professionalism. Think vibrant spice markets meets contemporary digital experience - colorful, inviting, and organized. The interface should feel welcoming to diverse age groups and tech comfort levels, emphasizing accessibility and clarity over complexity.

**Branding**: The application prominently features the official Swagath Indian Grocery logo from SwagathStores.com in the header, establishing immediate brand recognition and trust. The logo appears above the store name in all views, reinforcing the store's identity throughout the customer feedback experience.

## Color Selection

An Indian-inspired palette with warm, spiced tones that reflect the grocery's cultural roots while maintaining excellent readability.

- **Primary Color**: Deep Saffron `oklch(0.58 0.15 55)` - Represents Indian heritage, warmth, and positivity; used for primary actions and branding
- **Secondary Colors**: 
  - Turmeric Gold `oklch(0.75 0.12 85)` - Accents and highlights for important UI elements
  - Cardamom Green `oklch(0.45 0.08 145)` - Supporting color for success states and fresh produce context
- **Accent Color**: Vibrant Masala Red `oklch(0.55 0.20 25)` - Attention-grabbing for CTAs and critical actions
- **Foreground/Background Pairings**:
  - Primary (Deep Saffron): White text `oklch(0.99 0 0)` - Ratio 5.2:1 ✓
  - Accent (Masala Red): White text `oklch(0.99 0 0)` - Ratio 4.8:1 ✓
  - Background (Cream): Dark text `oklch(0.25 0.02 45)` - Ratio 10.5:1 ✓
  - Muted (Light Beige): Medium text `oklch(0.45 0.03 50)` - Ratio 5.5:1 ✓

## Font Selection

Typography should be friendly yet organized, reflecting the personal service of a family grocery store while ensuring excellent readability on mobile devices.

- **Primary Font**: Quicksand (Medium/SemiBold) - Rounded, approachable sans-serif that feels welcoming without sacrificing professionalism
- **Secondary Font**: Inter (Regular/Medium) - Clean, highly legible font for body text and form inputs

- **Typographic Hierarchy**: 
  - H1 (Store Name/Logo): Quicksand SemiBold/32px/tight letter-spacing/-0.02em
  - H2 (Section Headers): Quicksand SemiBold/24px/normal letter-spacing
  - H3 (Card Titles): Quicksand Medium/18px/normal letter-spacing
  - Body (Forms, Content): Inter Regular/16px/line-height 1.5/letter-spacing 0
  - Labels: Inter Medium/14px/line-height 1.4
  - Captions: Inter Regular/13px/line-height 1.3/letter-spacing 0.01em

## Animations

Animations should feel organic and responsive, enhancing usability without creating delays. Use subtle transitions to guide attention and confirm interactions, with moments of delight on successful feedback submission.

- Form field focus: Soft 200ms ease scale (1.01) and border color transition
- Button interactions: 150ms ease with slight lift (translateY -2px) on hover, press down effect on click
- Photo upload: Gentle fade-in (300ms) for thumbnails as they appear
- Success confirmation: Celebratory bounce animation (400ms) with confetti-style accent elements
- Page transitions: Smooth 300ms fade with slight vertical slide (20px)
- Filter application: Loading skeleton fade (250ms) while content updates
- Character counter: Color transition (200ms) from muted to warning (yellow) at 450 chars to destructive (red) at 500

## Component Selection

- **Components**:
  - `Card`: Main containers for feedback form and individual feedback items in admin view
  - `Select`: Category and subcategory dropdowns with search functionality
  - `Textarea`: Comment input with character counter overlay
  - `Input`: Product name field and date pickers for admin filtering, email address input for notifications
  - `Button`: Primary (submit feedback), secondary (add photos), destructive (delete/clear)
  - `Badge`: Category/subcategory tags in admin view, status indicators
  - `ScrollArea`: For long lists of feedback submissions in admin dashboard
  - `Calendar` (via react-day-picker): Date range selection for filtering
  - `Tabs`: Switch between customer view, admin view, QR code, and settings if owner is authenticated
  - `Avatar`: Admin user indicator in header
  - `Dialog`: Photo preview/enlargement, confirmation modals
  - `Label`: Form field labels with required indicators
  - `Switch`: Toggle email notifications on/off in settings

- **Customizations**:
  - Image upload component with thumbnail grid, drag-drop support, and preview modal
  - Character counter badge that overlays on textarea bottom-right
  - Feedback card component showing all submission details in scannable format
  - Empty state illustrations for "no feedback" states
  - Mobile-optimized photo capture button triggering device camera

- **States**:
  - Buttons: Default with solid background, hover with lift and brightness increase, active with press effect, disabled with reduced opacity
  - Inputs: Neutral border on default, primary color border on focus with subtle glow, error state with destructive color border and shake animation
  - Dropdowns: Chevron rotation on open, highlight on hover, checkmark on selected items
  - Photos: Thumbnail with remove button on hover, loading spinner during upload, error state with retry button

- **Icon Selection**:
  - Feedback/message: `ChatCircleDots` for main action
  - Photo upload: `Camera` for capture, `Image` for gallery
  - Categories: `ShoppingBag` for general, custom icons per category where appropriate
  - Admin: `User` for profile, `FunnelSimple` for filters, `Calendar` for dates, `ListChecks` for dashboard
  - Actions: `PaperPlaneRight` for submit, `X` for close/remove, `Check` for success, `FloppyDisk` for save
  - Navigation: `ArrowLeft` for back, `List` for view all, `QrCode` for QR code tab
  - Settings: `Gear` for settings tab, `EnvelopeSimple` for email notifications

- **Spacing**:
  - Page padding: `p-4` on mobile, `p-6` on tablet, `p-8` on desktop
  - Card padding: `p-6` for form, `p-4` for list items
  - Form field gaps: `gap-6` between major sections, `gap-4` within sections
  - Button groups: `gap-3` for related actions
  - Grid gaps: `gap-4` for photo thumbnails, `gap-6` for feedback cards

- **Mobile**:
  - Single column layout throughout with full-width components
  - Responsive text sizing (smaller on mobile, larger on desktop) for all headings and body text
  - Touch-optimized button sizes on mobile - larger touch targets (min 44px) for all interactive elements
  - Flexible tab navigation with abbreviated labels on mobile (e.g., "Feedback" vs "Submit Feedback") - 4 tabs for owners
  - Responsive grid layouts: 2 columns on mobile, 3+ on desktop for photo thumbnails
  - Delete buttons on photos always visible on mobile (no hover required)
  - Adaptive spacing: reduced padding and gaps on mobile screens
  - Date filter inputs stack vertically on mobile, horizontally on tablet/desktop
  - Feedback cards with flexible layouts that reflow on smaller screens
  - Optimized header with responsive font sizes and spacing
  - QR code display scales appropriately for mobile viewing
  - Photo upload optimized for mobile camera with full-screen preview
  - All form inputs and controls sized appropriately for touch interaction
  - Email settings form fully responsive with stacked layout on mobile
