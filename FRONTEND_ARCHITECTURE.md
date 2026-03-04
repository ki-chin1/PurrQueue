# PurrQueue Frontend Project - Architecture & Setup Guide

This document provides a comprehensive overview of the PurrQueue React frontend architecture, setup instructions, and development guidelines.

## 🎯 Project Overview

**PurrQueue** is a cat adoption and sales management platform. The React frontend provides:
- Public browsing of available cats
- User registration and login
- Application submission for cat adoption/purchase
- User dashboard to track applications
- Cattery owner dashboard to manage cat listings and applications

## 🏗️ Architecture

### Technology Stack
```
Frontend:
- React 19.2 (UI framework)
- TypeScript 5.9 (type safety)
- Vite 7.3 (build tool - ultra-fast)
- React Router 7.0 (client-side routing for SPA)
- Axios 1.7 (HTTP client with interceptors)
- Tailwind CSS 3.4 (utility-first CSS)
- React Context API (auth state management)

Backend:
- PHP 8+ (server language)
- MySQL 8+ (database)
- PDO (database access)
- Bcrypt (password hashing)
- JWT (authentication tokens)
```

### Project Structure

```
client/
├── public/                          # Static assets
├── src/
│   ├── api/
│   │   └── client.ts               # Centralized Axios client with interceptors
│   │                               # Exports: authAPI, catAPI, applicationAPI, imageAPI
│   ├── components/
│   │   ├── common/
│   │   │   └── CatCard.tsx         # Reusable cat display card
│   │   ├── layout/
│   │   │   ├── PublicLayout.tsx    # Header + footer for public pages
│   │   │   ├── UserDashboardLayout.tsx   # Sidebar + main for user dashboard
│   │   │   └── CatteryDashboardLayout.tsx # Sidebar + main for cattery dashboard
│   │   └── ProtectedRoute.tsx      # Route guard - checks auth & role
│   ├── context/
│   │   └── AuthContext.tsx         # Auth state provider + useAuth() hook
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx        # Landing page with hero + features
│   │   │   ├── LoginPage.tsx       # Email/password login
│   │   │   ├── RegisterPage.tsx    # Signup with role selection
│   │   │   ├── BrowseCatsPage.tsx  # Filtered cat listing
│   │   │   └── CatDetailPage.tsx   # Single cat details + apply button
│   │   ├── user/
│   │   │   ├── UserDashboardPage.tsx    # User overview + stats
│   │   │   ├── UserApplicationsPage.tsx # User's applications list
│   │   │   └── ApplyFormPage.tsx       # Application submission form
│   │   └── cattery/
│   │       ├── CatteryDashboardPage.tsx    # Cattery overview
│   │       ├── ManageCatsPage.tsx          # Edit/delete cat listings
│   │       └── ManageApplicationsPage.tsx  # Approve/reject applications
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   ├── App.tsx                     # Main router + page orchestration
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global Tailwind styles
├── index.html                      # HTML template
├── package.json                    # Dependencies + scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # CSS processing configuration
└── README.md                        # This file
```

## 🎯 Architecture Decisions & Why

### 1. Centralized Axios Client (`src/api/client.ts`)

**What it does:**
```typescript
// Single place for all HTTP requests
const cats = await catAPI.getAllCats();
const user = await authAPI.login(email, password);
const app = await applicationAPI.createApplication(...);
```

**Why this design:**
- **Consistency**: All requests use same interceptors (auth, error handling)
- **DRY**: Don't repeat auth code in every component
- **Maintainability**: Change API URL in one place affects all requests
- **Error handling**: 401 responses centrally redirect to login
- **Testability**: Can mock entire API in unit tests

**How it works:**
1. Request interceptor adds JWT token from localStorage to all requests
2. Response interceptor catches 401 errors (token expired) and redirects to login
3. All methods return typed responses (e.g., `Promise<Cat[]>`)

### 2. React Context API for Authentication

**What it does:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

**Why Context API instead of Redux?**
- Authentication is the only "global" state in this app
- Redux introduces boilerplate for simple needs
- Context API is built into React, no extra dependencies
- For complex state (multiple features), Redux would be better

**How persistence works:**
1. On login: token + user stored in localStorage
2. On app load: `useEffect` checks localStorage and restores auth state
3. This allows users to stay logged in after page refresh

### 3. ProtectedRoute Component

**What it does:**
```typescript
<Route path="/dashboard" element={<ProtectedRoute requiredRole="USER"><Dashboard /></ProtectedRoute>} />
```

**Why centralize route protection:**
- **Single responsibility**: One component handles all route guard logic
- **Consistent behavior**: Loading state, error handling identical everywhere
- **Role-based access**: Prevents wrong roles from accessing dashboards
- **DRY**: Don't repeat auth checks in every dashboard component

**How it works:**
1. Checks if user is authenticated (from Context)
2. Shows loading spinner while auth verification happens
3. If not authenticated: redirects to /login
4. If authenticated but wrong role: redirects to /
5. If authorized: renders child component

### 4. Layout-Based Component Structure

**Layouts separate concerns:**
- `PublicLayout`: Navigation + footer (no auth needed)
- `UserDashboardLayout`: Sidebar (user-specific nav) + main area
- `CatteryDashboardLayout`: Green-themed sidebar for cattery owners

**Why:**
- **Reusability**: Each page just wraps content in layout
- **Consistency**: All user dashboards have same layout
- **Separation**: Layout logic separate from page content
- **Theming**: Different layouts can have different colors/styles

### 5. TypeScript for Type Safety

**What it provides:**
```typescript
// TypeScript catches this error:
const cat: Cat = data; // OK if data.id, data.name, etc. exist
const name = cat.nama; // ERROR: Property 'nama' does not exist
```

**Why:**
- Prevents typos in property names (caught at development time, not runtime)
- IDE autocomplete: type `cat.` and see all available properties
- Documentation: types show what data structure looks like
- Refactoring: Change property name and compiler shows all usages

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User visits / (HomePage)                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────────┐
        │ AuthContext initializes on app load  │
        │ (checks localStorage for token)      │
        └──────────────────────────────────────┘
                          │
                    ┌─────┴────────┐
                    │              │
                  Token        No Token
                  found        found
                    │              │
                    ▼              ▼
            User is logged    Go to /login
            in automatically  if accessing
                             protected page
                    │              │
                    └─────┬────────┘
                          │
                ┌─────────────────────┐
                │ User clicks Register│
                └─────────────────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ RegisterPage sends: │
                │ POST /api/signup    │
                │ {email, password,   │
                │  role}              │
                └─────────────────────┘
                          │
                          ▼
          ┌──────────────────────────────────┐
          │ Backend creates user + returns   │
          │ {success, data: {               │
          │   token: "jwt_token",           │
          │   user: {id, email, role}       │
          │ }}                              │
          └──────────────────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────┐
        │ Frontend stores in:              │
        │ - localStorage (persists)        │
        │ - AuthContext (for components)   │
        └──────────────────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────┐
        │ Redirects to /dashboard          │
        │ (ProtectedRoute allows access)   │
        └──────────────────────────────────┘
```

## 📱 Routes & Pages

### Public Routes (No authentication required)
```
GET / → HomePage
  └─ Hero section, 3 feature cards, CTAs

GET /login → LoginPage
  └─ Email & password form, link to register

GET /register → RegisterPage
  └─ Role selection (USER/CATTERY_ADMIN), email, password form

GET /browse → BrowseCatsPage
  └─ Left sidebar: type/gender/status filters
  └─ Main area: grid of cats (12 per page), pagination

GET /cat/:id → CatDetailPage
  └─ Full cat info, image, apply button (or login link)
```

### User Dashboard Routes (role=USER, protected)
```
GET /dashboard → UserDashboardPage
  └─ Stats: total apps, approved, pending
  └─ Recent 3 applications
  └─ Quick action cards

GET /applications → UserApplicationsPage
  └─ All user's applications
  └─ Filter tabs: All, Pending, Approved, Rejected
  └─ Click to view details

GET /apply/:catId → ApplyFormPage
  └─ Form: name, phone, address, city, state, zip, reason
  └─ Prevents duplicate applications
  └─ Submits to /api/apply-cat.php
```

### Cattery Dashboard Routes (role=CATTERY_ADMIN, protected)
```
GET /cattery/dashboard → CatteryDashboardPage
  └─ Stats: total cats, applications, pending reviews
  └─ Recent activity feed

GET /cattery/cats → ManageCatsPage
  └─ Table of this cattery's cats
  └─ Actions: Edit, Delete
  └─ Add New Cat button

GET /cattery/applications → ManageApplicationsPage
  └─ Filter by status tabs
  └─ Approve/Reject buttons for pending apps
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org))
- **npm or yarn** (comes with Node.js)
- **Backend running** at `http://localhost/purrqueue/server/api`

### Installation

1. **Navigate to client directory**
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/purrqueue/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This installs:
   - react, react-dom, react-router-dom
   - axios (HTTP client)
   - typescript, vite (build tools)
   - tailwindcss (styling)
   - eslint (code linting)

3. **Create environment file**
   ```bash
   cp src/.env.example .env.local
   ```

4. **Update .env.local** if backend is on different URL:
   ```
   VITE_API_URL=http://localhost/purrqueue/server/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Output:
   ```
   VITE v7.3.1  ready in 123 ms
   ➜  Local:   http://localhost:5173/
   ➜  Press h to show help
   ```

6. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Should see PurrQueue home page

### Development Workflow

```bash
# Terminal 1: Start frontend dev server
cd client && npm run dev
# → Runs on http://localhost:5173

# Terminal 2: Start backend (if not already running)
# → Backend should be at http://localhost/purrqueue/server/api
```

**Hot Module Replacement (HMR):** When you edit a file and save, the page automatically updates without refresh (instant feedback while developing).

### Building for Production

```bash
npm run build
```

Creates optimized bundle in `dist/` folder:
- JavaScript minified and chunked
- CSS purged (unused styles removed)
- Assets fingerprinted (cache-busting)
- ~50-100KB gzipped (with all dependencies)

### Serving Production Build

```bash
npm run preview
```

Serves the built version on `http://localhost:4173` (to test production build locally).

## 🛠️ Development Guide

### Adding a New Page

1. **Create component** in `src/pages/feature/NewPage.tsx`
   ```tsx
   import { PublicLayout } from '../components/layout/PublicLayout';
   
   export function NewPage() {
     return (
       <PublicLayout>
         <div className="p-6">
           <h1>New Page Content</h1>
         </div>
       </PublicLayout>
     );
   }
   ```

2. **Add route** in `src/App.tsx`
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Use proper layout**
   - Public pages: wrap in `PublicLayout`
   - User pages: wrap in `UserDashboardLayout`
   - Cattery pages: wrap in `CatteryDashboardLayout`

### Making API Calls

```tsx
import { catAPI, applicationAPI, authAPI } from '../api/client';

// Cat operations
const cats = await catAPI.getAllCats();
const cat = await catAPI.getCatById(1);
await catAPI.createCat({...});
await catAPI.updateCat(1, {...});
await catAPI.deleteCat(1);

// Application operations
await applicationAPI.createApplication(catId, ...);
const apps = await applicationAPI.getMyApplications();

// Auth operations
await authAPI.signup(email, password, role);
await authAPI.login(email, password);
await authAPI.logout();
const user = await authAPI.getCurrentUser();
```

### Using Authentication

```tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={() => {
        logout();
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
}
```

### Working with TypeScript

All types defined in `src/types/index.ts`:

```typescript
// User type
interface User {
  id: number;
  email: string;
  role: 'USER' | 'CATTERY_ADMIN' | 'ADMIN';
  created_at: string;
}

// Cat type
interface Cat {
  id: number;
  name: string;
  breed: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  type: 'ADOPTION' | 'SALE';
  price?: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  description?: string;
  created_at: string;
}
```

Import and use in components:
```tsx
import { Cat, User } from '../types';

const cat: Cat = await catAPI.getCatById(1);
const user: User = await authAPI.getCurrentUser();
```

### Styling with Tailwind CSS

Tailwind provides utility classes for CSS:

```tsx
// Colors
className="text-blue-600 bg-green-100 border-red-500"

// Spacing (padding, margin)
className="p-6 m-4 my-2"

// Layout (flexbox, grid)
className="flex gap-4 md:grid md:grid-cols-3"

// Interactive states
className="hover:bg-blue-700 active:scale-95 disabled:opacity-50"

// Responsive (mobile-first)
className="w-full md:w-1/2 lg:w-1/3"
```

Common patterns used:
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Card styling
<div className="bg-white p-6 rounded-lg shadow hover:shadow-lg">

// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">

// Form input
<input className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" />

// Status badge
<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
```

## 🐛 Troubleshooting

### Frontend loads but API calls fail

**Problem:** "Failed to fetch from http://localhost/purrqueue/server/api"

**Solutions:**
1. Check backend is running (http://localhost/purrqueue/server should show something)
2. Verify `.env.local` has correct `VITE_API_URL`
3. Check browser Console (F12) for actual error message
4. Ensure backend returns CORS headers (for local development)

### Always redirects to /login when authenticated

**Problem:** Can't stay logged in even though token is in localStorage

**Solutions:**
1. Check `Authorization` header sent to backend (browser DevTools → Network)
2. Verify backend accepts `Authorization: Bearer <token>` format
3. Try logging in again (token might be expired)
4. Check backend logs for auth validation errors

### Tailwind styles not appearing

**Problem:** Classes like `p-6 text-blue-600` don't style elements

**Solutions:**
1. Run `npm install` to ensure tailwindcss is installed
2. Check `src/index.css` imports Tailwind directives (@tailwind base, components, utilities)
3. Restart dev server: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)

### "Module not found" errors

**Problem:** "Cannot find module '../some-file'"

**Solutions:**
1. Check file exists and path is correct (relative from current file)
2. Verify TypeScript path aliases if using them
3. Check `tsconfig.json` for correct `include` paths
4. Restart dev server

### Port 5173 already in use

**Problem:** "Address already in use: 127.0.0.1:5173"

**Solutions:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

## 📚 Learning Resources

- **React Docs**: https://react.dev (official React documentation)
- **React Router**: https://reactrouter.com (client-side routing)
- **Tailwind CSS**: https://tailwindcss.com/docs (utility CSS classes)
- **Axios**: https://axios-http.com (HTTP client)
- **TypeScript**: https://www.typescriptlang.org/docs (type safety)
- **Vite**: https://vite.dev (build tool)

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Test all pages and features locally
- [ ] Run `npm run build` and verify no errors
- [ ] Update `.env.local` with production API URL
- [ ] Test build locally: `npm run preview`
- [ ] Upload `dist/` folder to web server
- [ ] Configure web server for SPA routing (serve index.html for 404s)
- [ ] Test login/applications/dashboard on production URL
- [ ] Set up HTTPS (required for secure cookies/auth)
- [ ] Monitor error logs (browser console, backend logs)

## 📄 Additional Configuration Files

### `vite.config.ts`
```typescript
// Dev server settings
dev: {
  port: 5173,      // Dev server port
  open: true       // Auto-open browser
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,          // Strict type checking
    "jsx": "react-jsx",      // JSX syntax
    "moduleResolution": "bundler"
  }
}
```

### `tailwind.config.ts`
```typescript
{
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Where to look for classes
  plugins: [
    require('@tailwindcss/forms') // Better form styling
  ]
}
```

## 🤝 Contributing

When adding features:
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with proper typing
3. Test thoroughly before commit
4. Write clear commit messages
5. Create pull request with description

## 📞 Support

For issues or questions:
1. Check this README and troubleshooting section
2. Check browser Console (F12) for error messages
3. Check backend logs for API errors
4. Check GitHub issues for similar problems
5. Create detailed issue with error messages and steps to reproduce
