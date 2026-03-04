# PurrQueue Frontend - Code Files Reference

This document serves as a quick reference for all TypeScript/React files created for the PurrQueue frontend.

## 📂 Complete File Tree

```
client/
├── Configuration Files
│   ├── package.json               # npm dependencies + scripts
│   ├── vite.config.ts            # Vite build configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.node.json        # TypeScript for build tools
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS plugins
│   ├── index.html                # HTML template
│   ├── .env.example              # Environment variables template
│   └── .gitignore                # Git ignore patterns
│
├── src/
│   ├── API & State Management
│   │   ├── api/
│   │   │   └── client.ts         # Centralized Axios HTTP client
│   │   │                         # Exports: authAPI, catAPI, applicationAPI, imageAPI
│   │   │                         # Features: request/response interceptors, auth injection
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state management
│   │   │                         # Exports: AuthProvider, useAuth hook
│   │   │                         # Features: login, signup, logout, persistence
│   │   │
│   │   └── types/
│   │       └── index.ts          # All TypeScript interfaces
│   │                             # Types: User, Cat, Application, Auth, API responses
│   │
│   ├── Components
│   │   ├── ProtectedRoute.tsx    # Route guard component
│   │   │                         # Features: auth check, role validation, loading state
│   │   │
│   │   ├── common/
│   │   │   └── CatCard.tsx       # Reusable cat card component
│   │   │                         # Features: emoji, status badge, action buttons
│   │   │
│   │   └── layout/
│   │       ├── PublicLayout.tsx           # Public pages layout
│   │       │                              # Features: nav bar, footer, auth links
│   │       ├── UserDashboardLayout.tsx    # User dashboard layout
│   │       │                              # Features: sidebar, user nav, top bar
│   │       └── CatteryDashboardLayout.tsx # Cattery dashboard layout
│   │                                      # Features: sidebar, cattery nav, green theme
│   │
│   ├── Pages
│   │   ├── public/
│   │   │   ├── HomePage.tsx              # Landing page
│   │   │   │                             # Features: hero, 3 feature cards, CTAs
│   │   │   ├── LoginPage.tsx             # Login form
│   │   │   │                             # Features: email/password, error handling, link to register
│   │   │   ├── RegisterPage.tsx          # Signup form
│   │   │   │                             # Features: role selection, validation, auto-login
│   │   │   ├── BrowseCatsPage.tsx        # Cat listing
│   │   │   │                             # Features: sidebar filters, grid, pagination (12/page)
│   │   │   └── CatDetailPage.tsx         # Single cat details
│   │   │                                 # Features: full info, status-based actions, apply/login
│   │   │
│   │   ├── user/
│   │   │   ├── UserDashboardPage.tsx       # User overview
│   │   │   │                               # Features: stats cards, recent apps, quick actions
│   │   │   ├── UserApplicationsPage.tsx    # Applications list
│   │   │   │                               # Features: filter tabs, status badges, view details
│   │   │   └── ApplyFormPage.tsx           # Application form
│   │   │                                   # Features: cat pre-filled, full form, validation
│   │   │
│   │   └── cattery/
│   │       ├── CatteryDashboardPage.tsx        # Cattery overview
│   │       │                                   # Features: stats, pending apps, activity feed
│   │       ├── ManageCatsPage.tsx              # Manage listings
│   │       │                                   # Features: table view, edit/delete, add new
│   │       └── ManageApplicationsPage.tsx      # Manage applications
│   │                                           # Features: approve/reject, filter by status
│   │
│   ├── Core Files
│   │   ├── App.tsx               # Main router (11 routes)
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Global Tailwind styles
│
├── public/                       # Static assets
│
└── Documentation
    ├── README.md                 # Project overview
    ├── INSTALLATION.md           # Installation guide (detailed)
    ├── FRONTEND_ARCHITECTURE.md  # Architecture guide (200+ lines)
    └── FRONTEND_SUMMARY.md       # Implementation summary
```

## 🔍 File Details

### 1. `src/api/client.ts`
**Purpose**: Centralized HTTP client for all API requests

**Key Features**:
- Single Axios instance with base URL from env
- Request interceptor: Adds JWT token to all requests
- Response interceptor: Handles 401 errors (logout + redirect)
- Organized into 5 API groups (authAPI, catAPI, etc.)

**Methods Exported**:
```typescript
authAPI.signup(email, password, role)
authAPI.login(email, password)
authAPI.logout()
authAPI.getCurrentUser()
authAPI.getAllUsers()
authAPI.updateUser(id, data)

catAPI.getAllCats()
catAPI.getCatById(id)
catAPI.createCat(data)
catAPI.updateCat(id, data)
catAPI.deleteCat(id)

applicationAPI.createApplication(...)
applicationAPI.getMyApplications()
applicationAPI.getApplicationsByCat(catId)
applicationAPI.getApplicationById(id)

imageAPI.uploadImage(formData)
imageAPI.getImagesByCat(catId)
imageAPI.deleteImage(id)
```

---

### 2. `src/context/AuthContext.tsx`
**Purpose**: Global authentication state management

**Key Features**:
- AuthProvider component wraps entire app
- useAuth() hook provides auth state to any component
- Auto-saves token & user to localStorage
- Auto-restores from localStorage on app load
- Login/signup/logout functions

**Exports**:
```typescript
AuthProvider              // Wrapper component
useAuth()               // Hook to access auth state: { user, isAuthenticated, login, signup, logout, loading }
```

**Usage**:
```tsx
const { user, isAuthenticated, login } = useAuth();
```

---

### 3. `src/components/ProtectedRoute.tsx`
**Purpose**: Route guard for authenticated pages

**Key Features**:
- Checks if user is authenticated
- Validates user role matches required role
- Shows loading spinner while checking auth
- Redirects to /login if not authenticated
- Redirects to / if wrong role

**Props**:
```typescript
requiredRole?: 'USER' | 'CATTERY_ADMIN' | 'ADMIN'  // Optional role check
children: React.ReactNode                           // Page component to render
```

**Usage**:
```tsx
<ProtectedRoute requiredRole="USER">
  <UserDashboardPage />
</ProtectedRoute>
```

---

### 4. `src/components/common/CatCard.tsx`
**Purpose**: Reusable cat display component

**Key Features**:
- Shows cat emoji placeholder (🐱)
- Displays name, breed, gender, age, type, price
- Color-coded status badge
- Optional action buttons (view details, apply, edit, delete)
- Responsive card styling

**Props**:
```typescript
cat: Cat                                    // Cat data
onViewDetails?: () => void                 // Click handler for View Details
onApply?: () => void                       // Click handler for Apply
onEdit?: () => void                        // Click handler for Edit
onDelete?: () => void                      // Click handler for Delete
showActions?: boolean                      // Show edit/delete buttons
```

---

### 5. `src/components/layout/PublicLayout.tsx`
**Purpose**: Layout for public pages (home, login, register, browse, cat detail)

**Features**:
- Navigation bar with logo, links, auth status
- Responsive mobile menu (if needed)
- Footer with company info
- Main content area between nav and footer

**Used By**: HomePage, LoginPage, RegisterPage, BrowseCatsPage, CatDetailPage

---

### 6. `src/components/layout/UserDashboardLayout.tsx`
**Purpose**: Layout for user dashboard pages

**Features**:
- Sidebar with user navigation (Dashboard, Browse, Applications, Apply)
- Logout button
- Top bar showing user role
- Main content area
- Green/blue color theme

**Used By**: UserDashboardPage, UserApplicationsPage, ApplyFormPage

---

### 7. `src/components/layout/CatteryDashboardLayout.tsx`
**Purpose**: Layout for cattery dashboard pages

**Features**:
- Sidebar with cattery navigation (Dashboard, Manage Cats, Applications)
- Logout button
- Top bar showing cattery role
- Main content area
- Green color theme (stronger than user)

**Used By**: CatteryDashboardPage, ManageCatsPage, ManageApplicationsPage

---

### 8. `src/pages/public/HomePage.tsx`
**Route**: `/`
**Layout**: PublicLayout

**Features**:
- Hero section with welcome message
- "Browse Cats" and "Register" CTAs
- 3 feature cards (Browse, Apply, List)
- Responsive design

---

### 9. `src/pages/public/LoginPage.tsx`
**Route**: `/login`
**Layout**: PublicLayout

**Features**:
- Email and password input fields
- Submit button with loading state
- Error message display
- Link to register
- Redirects to /dashboard on success

**API Call**: `authAPI.login(email, password)`

---

### 10. `src/pages/public/RegisterPage.tsx`
**Route**: `/register`
**Layout**: PublicLayout

**Features**:
- Role selection (USER or CATTERY_ADMIN) with descriptions
- Email input
- Password with minimum length requirement
- Confirm password validation
- Client-side and server-side validation
- Auto-logs in after successful signup
- Redirects to /dashboard

**API Call**: `authAPI.signup(email, password, role)`

---

### 11. `src/pages/public/BrowseCatsPage.tsx`
**Route**: `/browse`
**Layout**: PublicLayout

**Features**:
- Left sidebar with filters:
  - Type (All, For Adoption, For Sale)
  - Gender (All, Male, Female)
  - Status (All, Available, Reserved, Sold)
  - Clear filters button
- Main area with cat grid (responsive: 1/2/3 columns)
- Pagination (12 cats per page with prev/next)
- Shows result count
- Click cat to go to detail page
- Real-time filtering (no API call needed)

**API Call**: `catAPI.getAllCats()` (once on load)

---

### 12. `src/pages/public/CatDetailPage.tsx`
**Route**: `/cat/:id`
**Layout**: PublicLayout

**Features**:
- Cat emoji placeholder (large)
- Full cat information (breed, gender, age, type, price)
- Status badge with color
- Description if available
- Status-specific action button:
  - If AVAILABLE: "Apply for this cat" (logged in) or "Login to Apply" (not logged in)
  - If RESERVED: "This cat is reserved" (disabled)
  - If SOLD: "This cat has been sold" (disabled)
- Back button
- 404 page if cat not found

**API Call**: `catAPI.getCatById(id)`

---

### 13. `src/pages/user/UserDashboardPage.tsx`
**Route**: `/dashboard`
**Layout**: UserDashboardLayout
**Protection**: Requires USER role

**Features**:
- Welcome greeting with user email
- 3 stat cards: Total Apps, Approved, Pending
- 2 quick action cards: Browse Cats, My Applications
- Recent applications list (last 3)
- Link to view all applications

**API Call**: `applicationAPI.getMyApplications()`

---

### 14. `src/pages/user/UserApplicationsPage.tsx`
**Route**: `/applications`
**Layout**: UserDashboardLayout
**Protection**: Requires USER role

**Features**:
- Status filter tabs (All, Pending, Approved, Rejected)
- Application list cards showing:
  - Application ID
  - Submission date
  - Status badge with message
- Click card to view details
- Empty state with browse link

**API Call**: `applicationAPI.getMyApplications()`

---

### 15. `src/pages/user/ApplyFormPage.tsx`
**Route**: `/apply/:catId`
**Layout**: UserDashboardLayout
**Protection**: Requires USER role

**Features**:
- Cat info card at top (name, breed, gender, age, price if sale)
- Application form with fields:
  - Full Name
  - Phone Number
  - Street Address
  - City, State, ZIP Code
  - Why do you want this cat? (textarea)
- Form validation
- Submit/Cancel buttons
- Prevents duplicate applications (backend checks)
- Redirects to /applications on success

**API Call**: `applicationAPI.createApplication(...)`

---

### 16. `src/pages/cattery/CatteryDashboardPage.tsx`
**Route**: `/cattery/dashboard`
**Layout**: CatteryDashboardLayout
**Protection**: Requires CATTERY_ADMIN role

**Features**:
- Welcome greeting
- 3 stat cards: Cats Listed, Total Applications, Pending Review
- 2 quick action cards: Manage Cats, View Applications
- Recent activity feed (new applications)

**API Calls**: `catAPI.getAllCats()`, `applicationAPI.*`

---

### 17. `src/pages/cattery/ManageCatsPage.tsx`
**Route**: `/cattery/cats`
**Layout**: CatteryDashboardLayout
**Protection**: Requires CATTERY_ADMIN role

**Features**:
- "Add New Cat" button
- Table view with columns:
  - Name
  - Breed
  - Type (Adoption/Sale)
  - Price
  - Status
  - Actions (Edit/Delete)
- Confirmation dialogs for delete
- Empty state with add button
- Displays cat count

**API Calls**: `catAPI.getAllCats()`, `catAPI.deleteCat(id)`

---

### 18. `src/pages/cattery/ManageApplicationsPage.tsx`
**Route**: `/cattery/applications`
**Layout**: CatteryDashboardLayout
**Protection**: Requires CATTERY_ADMIN role

**Features**:
- Status filter tabs (All, Pending, Approved, Rejected)
- Table view with columns:
  - Application ID
  - Applicant (clickable to view details)
  - Submitted date
  - Status badge
  - Actions (Approve/Reject for pending, display status for decided)
- Confirmation dialogs for actions
- Displays count for each status
- Empty state

**API Calls**: `applicationAPI.*` (needs backend methods for cattery-specific data)

---

### 19. `src/App.tsx`
**Purpose**: Main React Router configuration

**Features**:
- BrowserRouter wrapper for SPA routing
- AuthProvider wrapper for global auth state
- 11 total routes organized in 3 groups:
  - Public routes (no auth required)
  - User protected routes (USER role)
  - Cattery protected routes (CATTERY_ADMIN role)
- Catch-all route redirects to home

**Routes Defined**:
```
Public:
  / → HomePage
  /login → LoginPage
  /register → RegisterPage
  /browse → BrowseCatsPage
  /cat/:id → CatDetailPage

User:
  /dashboard → UserDashboardPage (protected, role=USER)
  /applications → UserApplicationsPage (protected, role=USER)
  /apply/:catId → ApplyFormPage (protected, role=USER)

Cattery:
  /cattery/dashboard → CatteryDashboardPage (protected, role=CATTERY_ADMIN)
  /cattery/cats → ManageCatsPage (protected, role=CATTERY_ADMIN)
  /cattery/applications → ManageApplicationsPage (protected, role=CATTERY_ADMIN)

Catch-all:
  * → Navigate to / (home)
```

---

### 20. `src/main.tsx`
**Purpose**: React application entry point

**Features**:
- Imports and renders App component
- Mounts to DOM element with id="root"
- Wrapped in React.StrictMode for dev checks

---

### 21. `src/index.css`
**Purpose**: Global styles

**Features**:
- Tailwind CSS @tailwind directives
- Custom global styles (e.g., scroll behavior)
- Form styling

---

### 22. `src/types/index.ts`
**Purpose**: Central TypeScript type definitions

**Types Defined**:
```typescript
User                  // { id, email, role, created_at }
Cat                   // { id, name, breed, gender, age, type, price?, status, description?, created_at }
Application           // { id, user_id, cat_id, status, created_at, updated_at, full_name?, phone?, address?, city?, state?, zip?, reason? }
CatImage              // { id, cat_id, image_url, created_at }
AuthContextType       // { user, isAuthenticated, loading, login, signup, logout }
SignupData            // { email, password, role }
LoginRequest          // { email, password }
ApiResponse<T>        // { success, data, message?, error? }
LoginResponse         // { success, token, user }
```

---

## 📊 Component Dependency Map

```
App.tsx (Router)
├── AuthProvider (AuthContext)
│
├── Public Routes
│   ├── HomePage
│   ├── LoginPage → useAuth → authAPI.login
│   ├── RegisterPage → useAuth → authAPI.signup
│   ├── BrowseCatsPage → catAPI.getAllCats → CatCard
│   └── CatDetailPage → catAPI.getCatById
│
├── User Protected Routes (ProtectedRoute → useAuth)
│   ├── UserDashboardLayout
│   │   ├── UserDashboardPage → applicationAPI.getMyApplications
│   │   ├── UserApplicationsPage → applicationAPI.getMyApplications
│   │   └── ApplyFormPage → catAPI.getCatById → applicationAPI.createApplication
│
└── Cattery Protected Routes (ProtectedRoute → useAuth)
    ├── CatteryDashboardLayout
    │   ├── CatteryDashboardPage → catAPI, applicationAPI
    │   ├── ManageCatsPage → catAPI.getAllCats, catAPI.deleteCat
    │   └── ManageApplicationsPage → applicationAPI.*
```

---

## 🔑 Key Patterns Used

### 1. Custom Hook Pattern (useAuth)
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 2. Centralized API Client
```typescript
const cats = await catAPI.getAllCats();
```

### 3. Protected Routes
```tsx
<ProtectedRoute requiredRole="USER">
  <Component />
</ProtectedRoute>
```

### 4. Layout Composition
```tsx
<UserDashboardLayout>
  {/* Page content */}
</UserDashboardLayout>
```

### 5. Type-Safe Data
```typescript
const cat: Cat = await catAPI.getCatById(1);
```

---

## 📝 File Statistics

- **Total Files**: 22 TypeScript/TSX + config files
- **Total Lines of Code**: ~3,500+ lines (including comments)
- **Pages**: 12
- **Components**: 6 (3 layouts + 1 guard + 1 reusable + root)
- **API Groups**: 4
- **Context Providers**: 1
- **Routes**: 11

---

## 🚀 Starting Development

1. Install: `npm install`
2. Create env: `cp src/.env.example .env.local`
3. Start: `npm run dev`
4. Visit: `http://localhost:5173`

Happy coding! 🎉
