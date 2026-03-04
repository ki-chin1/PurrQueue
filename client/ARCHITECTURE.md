# Architecture Decision Records (ADR)

## Overview
This document explains the key architectural decisions made during PurrQueue frontend development and the reasoning behind each choice.

---

## ADR-001: Use Context API Instead of Redux

**Status**: ✅ Accepted

### Decision
Use React Context API with custom hooks for global state management instead of Redux.

### Rationale
1. **Simplicity**: Auth state is relatively simple - just token, user, and loading flag
2. **Less Boilerplate**: No need for actions, reducers, dispatch functions
3. **Built-in**: Context API is part of React core, no external dependency
4. **Performance**: useCallback and proper memoization prevent unnecessary re-renders
5. **Sufficient**: Current auth needs don't justify Redux complexity
6. **Learning Curve**: Easier for new developers to understand and maintain

### Alternatives Considered
- Redux (too complex for current needs)
- Zustand (lightweight but still overkill)
- Prop drilling (unmaintainable as app grows)

### Trade-offs
- **Pro**: Simpler code, smaller bundle
- **Con**: Not ideal if auth state becomes very complex in future

### When to Reconsider
If app adds:
- Complex global state (user settings, notifications, etc.)
- Multiple sources of truth
- Complex state transformations

---

## ADR-002: Vite as Build Tool

**Status**: ✅ Accepted

### Decision
Use Vite as the build tool and dev server instead of Create React App or Webpack.

### Rationale
1. **Fast Development**: Native ESM support = instant HMR (no full page reload)
2. **Fast Builds**: Esbuild-based - dramatically faster than Webpack
3. **Modern**: Assumes modern browser support (ES2020+)
4. **Zero Config**: Works out of the box with sensible defaults
5. **Future-proof**: Actively maintained, industry moving toward Vite

### Alternatives Considered
- Create React App (slow HMR, slower builds)
- Webpack (complex configuration, slower)
- Next.js (too heavy, SSR not needed here)

### Trade-offs
- **Pro**: Fast development experience, quick builds
- **Con**: Less community examples for edge cases (not really an issue)

---

## ADR-003: TypeScript for Type Safety

**Status**: ✅ Accepted

### Decision
Use TypeScript throughout the application for type safety and better IDE support.

### Rationale
1. **Type Safety**: Catch errors at compile time, not runtime
2. **Better IDE Support**: Autocomplete, go-to-definition, refactoring
3. **Documentation**: Types serve as inline documentation
4. **Developer Experience**: Refactoring is safer and easier
5. **Maintainability**: Easier to understand code intentions
6. **Scale**: Better for large codebases

### Alternatives Considered
- Plain JavaScript (less safe, harder to maintain)
- Flow (less community adoption)

### Trade-offs
- **Pro**: Type safety, better DX, self-documenting code
- **Con**: Slight build time increase (minimal with Vite)

---

## ADR-004: Tailwind CSS for Styling

**Status**: ✅ Accepted

### Decision
Use Tailwind CSS for styling instead of CSS-in-JS or traditional CSS files.

### Rationale
1. **Utility-first**: Fast styling without context switching
2. **Consistent**: Predefined design tokens prevent inconsistency
3. **Small Bundle**: Purges unused CSS, typically < 10KB gzipped
4. **Responsive**: Built-in responsive prefixes (sm:, md:, lg:)
5. **Performance**: No CSS-in-JS runtime overhead
6. **Learning Curve**: Easy to learn, component-focused

### Alternatives Considered
- CSS Modules (verbose, context switching)
- Styled Components (runtime overhead, larger bundle)
- Traditional CSS (inconsistency, no design system)

### Trade-offs
- **Pro**: Small bundle, consistent design, fast development
- **Con**: HTML can look cluttered with many classes (acceptable)

---

## ADR-005: Centralized Route Configuration

**Status**: ✅ Accepted

### Decision
Define all routes in a single `routes/index.tsx` file instead of scattered throughout components.

### Rationale
1. **Single Source of Truth**: Easy to see entire app structure
2. **Maintainability**: Add/remove routes in one place
3. **Consistency**: Apply layouts and protection consistently
4. **Documentation**: Routes serve as app documentation
5. **Easier Refactoring**: Change route paths in one place

### Alternatives Considered
- File-based routing (Next.js style) - adds framework overhead
- Scattered route definitions - hard to maintain

### Trade-offs
- **Pro**: Easy to visualize app, consistent patterns
- **Con**: One larger file (acceptable, < 200 lines)

---

## ADR-006: Separate Layouts for Different User Types

**Status**: ✅ Accepted

### Decision
Create three separate layout components (PublicLayout, UserLayout, CatteryLayout) instead of one universal layout.

### Rationale
1. **Different Needs**: Each user type has different visual hierarchy
2. **Flexibility**: Easy to add role-specific features to layouts
3. **Clean Separation**: No conditional logic cluttering layout component
4. **Reusability**: Layouts wrap multiple pages consistently
5. **Future-proof**: Easy to add admin layout, other roles

### Alternatives Considered
- Single layout with conditionals (hard to maintain)
- Layout props system (over-engineered)

### Trade-offs
- **Pro**: Clean, flexible, maintainable
- **Con**: Some code duplication (minimal and acceptable)

---

## ADR-007: API Endpoint Organization by Feature

**Status**: ✅ Accepted

### Decision
Organize API endpoints into feature-based objects (authAPI, catAPI, applicationAPI) instead of individual functions.

### Rationale
1. **Discoverability**: All auth calls under `authAPI.*`
2. **Scalability**: Easy to add new endpoints to features
3. **Consistent Naming**: Feature-based prefixes create natural naming
4. **Single File**: Easy to find what API calls exist
5. **Easy to Update**: Change backend URL in one place

### Alternatives Considered
- Individual functions (hard to find, no organization)
- Class-based API client (over-engineered for this scale)

### Trade-offs
- **Pro**: Well-organized, easy to find, scalable
- **Con**: One file might grow large (currently ~80 lines, acceptable)

---

## ADR-008: useAuth Custom Hook for Context Access

**Status**: ✅ Accepted

### Decision
Create custom `useAuth` hook to encapsulate AuthContext access instead of exposing context directly.

### Rationale
1. **Error Checking**: Hook validates it's used inside provider
2. **Cleaner Components**: Import hook, not context
3. **Flexibility**: Can add logic to hook later without breaking components
4. **Consistency**: All context access goes through same interface
5. **Additional Utilities**: Hook provides `useHasRole`, `useIsAdmin` helpers

### Alternatives Considered
- Use context directly in components (no validation, error-prone)
- Class-based consumer pattern (verbose, outdated)

### Trade-offs
- **Pro**: Type-safe, with error checking, clean DX
- **Con**: Extra abstraction layer (minimal, just a wrapper)

---

## ADR-009: Protected Route Component with Role Checking

**Status**: ✅ Accepted

### Decision
Create ProtectedRoute component that handles authentication and role-based authorization.

### Rationale
1. **Centralized Logic**: All route protection in one place
2. **Consistency**: All protected routes use same pattern
3. **Clean Routes**: Route configuration stays clean
4. **Easy to Test**: Component encapsulates protection logic
5. **Flexible**: Supports multiple required roles

### Alternatives Considered
- Manual checks in each page component (error-prone, duplicated)
- HOC pattern (more complex, less readable)

### Trade-offs
- **Pro**: Consistent protection, DRY principle, testable
- **Con**: Requires understanding of component pattern (standard in React)

---

## ADR-010: localStorage for Token Persistence

**Status**: ✅ Accepted

### Decision
Store JWT token in browser's localStorage with fallback to sessionStorage for sensitive environments.

### Rationale
1. **Persistence**: Token survives page refreshes
2. **Auto-login**: Users stay logged in across sessions
3. **Simple**: No server-side session state needed
4. **Standard**: Industry standard for SPA authentication
5. **Automatic Injection**: Token auto-injected via Axios interceptor

### Alternatives Considered
- sessionStorage (loses token on browser close - not ideal)
- Cookie (CSRF protection required, server setup needed)
- Memory only (users logged out on refresh - bad UX)

### Trade-offs
- **Pro**: Good UX, simple, standard approach
- **Con**: Vulnerable to XSS attacks (mitigated by HTTPS + sanitization)

---

## ADR-011: Axios with Interceptors for API Calls

**Status**: ✅ Accepted

### Decision
Use Axios with request/response interceptors for centralized API handling instead of fetch.

### Rationale
1. **Request Interceptor**: Automatically injects JWT token
2. **Response Interceptor**: Handles 401 errors globally (redirect to login)
3. **Configuration**: Centralized timeout, baseURL, defaults
4. **Error Handling**: Consistent error handling across app
5. **DRY**: Don't repeat auth headers in every request

### Alternatives Considered
- Fetch API (no interceptors, manual header management)
- GraphQL (overkill, REST API simpler)

### Trade-offs
- **Pro**: Less boilerplate, centralized logic, automatic token injection
- **Con**: Extra dependency (minimal, widely used)

---

## ADR-012: Component-Level State with useState/useReducer

**Status**: ✅ Accepted

### Decision
Use component-level state (useState) for page-specific state instead of pushing everything to global context.

### Rationale
1. **Scalability**: Avoid bloating global state
2. **Performance**: Only re-render components that need updates
3. **Simplicity**: Page state is self-contained
4. **Flexibility**: Easy to manage local state
5. **Modularity**: Components don't depend on global state

### Rules Applied
- Local page state: useState
- User authentication: Context API
- Shared data across pages: Could use Context (none currently needed)

### Trade-offs
- **Pro**: Clean separation, good performance, simple logic
- **Con**: Can't easily share state between pages (not needed yet)

---

## ADR-013: TypeScript Interfaces Over Type Aliases

**Status**: ✅ Accepted

### Decision
Use `interface` for object types instead of type aliases.

### Rationale
1. **Extensibility**: Can extend interfaces with `extends`
2. **Declaration Merging**: TypeScript allows extending same interface multiple times
3. **Tools**: Better support in IDE tooling
4. **Convention**: Interfaces for objects, types for unions/primitives

### Examples
```typescript
interface User { ... }  // Objects and contracts
type UserRole = 'USER' | 'ADMIN'  // Unions
```

### Trade-offs
- **Pro**: Better extensibility, convention-based
- **Con**: Type aliases are flexible too (minor)

---

## ADR-014: Folder Structure by Feature (Not by Type)

**Status**: ✅ Accepted

### Decision
Organize code by feature/domain (pages, components by role) instead of by type (components, utils, hooks).

### Rationale
1. **Discoverability**: Find all related code in one folder
2. **Modularity**: Easy to understand feature
3. **Scalability**: Easy to add new features
4. **Maintenance**: Feature removal doesn't scatter broken imports
5. **Team Structure**: Matches how teams are often organized

### Structure
```
pages/public/    - All public pages
pages/user/      - All user pages
pages/cattery/   - All cattery pages
components/      - Shared components
api/             - API configuration
```

### Trade-offs
- **Pro**: Feature-focused organization, scalable, maintainable
- **Con**: Some shared folders (api, types, components - necessary)

---

## ADR-015: Error Boundary Not Implemented (Yet)

**Status**: ⏳ Deferred

### Decision
Currently not implementing Error Boundary component (catches React errors).

### Rationale
1. **Current Scope**: Focus on main features first
2. **Add When Needed**: Can add easily as app grows
3. **Not Critical**: Most errors are handled with try/catch
4. **Development**: Easier to catch errors without boundary

### When to Add
- App grows to > 100 components
- Need global error tracking (Sentry)
- Production monitoring required

### Plan
Simple Error Boundary component would:
```typescript
// Catches rendering errors
// Logs to error tracking service
// Shows fallback UI
```

---

## ADR-016: No Redux DevTools (Simpler Debugging)

**Status**: ✅ Accepted

### Decision
Not use Redux DevTools or similar state debugging tools.

### Rationale
1. **Simple State**: Just token, user, loading flag
2. **React DevTools**: Built-in browser debugging sufficient
3. **Logs**: Add console logs where needed
4. **Complexity**: Overhead not justified

### Alternatives When State Gets Complex
- Redux DevTools if move to Redux
- MobX DevTools if move to MobX
- Custom logging solution

### Trade-offs
- **Pro**: Simpler setup, less overhead
- **Con**: Manual debugging (acceptable for current state)

---

## ADR-017: Responsive Design: Mobile-First

**Status**: ✅ Accepted

### Decision
Use mobile-first responsive design with Tailwind's responsive classes.

### Approach
1. Start with mobile layout
2. Add `md:` classes for tablets
3. Add `lg:` classes for desktops
4. Base styles work on all screens

### Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Trade-offs
- **Pro**: Better mobile experience, SEO benefits
- **Con**: Need to test on multiple sizes

---

## ADR-018: No Pre-rendering (SPA with Client-side Routing)

**Status**: ✅ Accepted

### Decision
Build as Single Page Application (SPA) with client-side routing instead of static generation.

### Rationale
1. **Dynamic Content**: Cat listings, user dashboards change frequently
2. **Authentication**: Routes need runtime authentication checks
3. **Interaction**: Lots of interactive features
4. **Simpler**: No build-time data fetching needed

### Alternatives Considered
- Static generation (SSG) - wrong for dynamic content
- Server-side rendering (SSR) - unnecessary complexity

### Trade-offs
- **Pro**: Dynamic content, real-time updates, simple architecture
- **Con**: First page load slower (mitigated by Vite optimizations)

---

## ADR-019: Image Handling: URL-Based Not File Upload

**Status**: ✅ Accepted (Based on User Feedback)

### Decision
Store image URLs instead of uploading files to server.

### Rationale
1. **Simpler**: No file handling complexity
2. **Scalable**: No server storage limits
3. **User Preference**: "Can I just use a link?" - yes!
4. **Cloud Ready**: Can use external image URLs
5. **Flexible**: URLs can be from any source

### Implementation
```typescript
imageAPI.uploadImage(catId, imageUrl)  // Pass URL, not file
imageAPI.getCatImages(catId)           // Get URLs for display
```

### Trade-offs
- **Pro**: Simple, flexible, no server storage needed
- **Con**: Users must have image URLs available

---

## ADR-020: No Environment-Specific Configurations (Yet)

**Status**: ✅ Accepted

### Decision
Currently using single .env file for API URL. Plan for environment-specific configs when needed.

### Current Setup
```
.env  → All environments use same URL
```

### When to Expand
```
.env.development    → Local dev
.env.staging        → Staging server
.env.production     → Production
```

### Vite Support
Vite automatically supports:
```bash
npm run dev          # Uses .env.development (or .env)
npm run build        # Uses .env.production (or .env)
```

### Trade-offs
- **Pro**: Simple for single environment
- **Con**: Need to split when deploy to multiple environments

---

## Summary Table

| ADR | Decision | Status | Trade-off |
|-----|----------|--------|-----------|
| 001 | Context API | ✅ | Simple > Redux features |
| 002 | Vite | ✅ | Speed > CRA ecosystem |
| 003 | TypeScript | ✅ | Type safety > Dev time |
| 004 | Tailwind CSS | ✅ | Bundle size > Components |
| 005 | Centralized Routes | ✅ | Maintainability > No |
| 006 | Multiple Layouts | ✅ | Flexibility > Code duplication |
| 007 | Feature-based API | ✅ | Organization > File size |
| 008 | useAuth Hook | ✅ | DRY > Extra abstraction |
| 009 | ProtectedRoute | ✅ | Consistency > Component nesting |
| 010 | localStorage | ✅ | UX > XSS risk (mitigated) |
| 011 | Axios + Interceptors | ✅ | Convenience > Extra lib |
| 012 | Component State | ✅ | Performance > Context |
| 013 | Interfaces | ✅ | Extensibility > Flexibility |
| 014 | Feature Folders | ✅ | Discovery > Some duplication |
| 015 | No Error Boundary | ⏳ | Current needs > Future-proof |
| 016 | No Redux DevTools | ✅ | Simplicity > Debug power |
| 017 | Mobile-first | ✅ | Mobile experience > Desktop |
| 018 | SPA Only | ✅ | Simplicity > Pre-rendering |
| 019 | URL-based Images | ✅ | Simplicity > File management |
| 020 | Single .env | ✅ | Simplicity > Multi-env |

---

## Future ADR Candidates

1. **Error Handling**: Implement error boundary and error tracking
2. **State Management**: Consider Context expansion if state grows
3. **Testing**: Add Jest and React Testing Library
4. **Performance**: Implement lazy loading, code splitting
5. **Internationalization**: Support multiple languages
6. **Accessibility**: WCAG 2.1 AA compliance
7. **PWA Features**: Offline support, installable app
8. **Analytics**: User behavior tracking

---

**Document Version**: 1.0  
**Last Updated**: March 2, 2025  
**Authors**: Development Team
