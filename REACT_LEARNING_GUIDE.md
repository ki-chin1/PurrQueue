# React Learning Guide - PurrQueue Project

## Overview
This document outlines advanced React techniques and patterns used in the PurrQueue cat adoption platform. These techniques demonstrate professional-grade React development practices.

---

## Core React Techniques & Concepts

### 1. **React Hooks**
Hooks allow you to use state and other React features without writing class components.

#### `useState` Hook
- **Used for**: Managing component-level state
- **Examples in project**:
  - `Login.tsx`: Managing form input and submission state
  - `ManageCats.tsx`: Managing form data and UI visibility
  - `Dashboard.tsx`: Managing loading states and data

```tsx
const [isLoading, setIsLoading] = useState(true);
const [formData, setFormData] = useState({ name: '', email: '' });
```

**Key Learning Points**:
- State updates are asynchronous
- Multiple useState calls = multiple state variables
- State should be immutable (never directly modify objects/arrays)

#### `useEffect` Hook
- **Used for**: Side effects like API calls, subscriptions, timers
- **Examples in project**:
  - Fetching cat data when component mounts
  - Validating auth status on app load
  - Refreshing dashboards

```tsx
useEffect(() => {
  fetchCats();
}, [catId]); // Dependency array
```

**Key Learning Points**:
- Runs after every render (if no dependency array)
- Empty dependency array `[]` = runs once on mount
- Dependencies control when effect runs
- Cleanup functions for subscriptions/timers

#### Custom Hooks
- **Used for**: Reusable logic across components
- **Example**: `useAuth` hook in the project

```tsx
// hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Key Learning Points**:
- Name custom hooks with `use` prefix
- Can call other hooks inside custom hooks
- Extract complex logic into custom hooks for reusability

---

### 2. **Context API & Global State Management**

#### Context for Auth State
- **Purpose**: Share auth state across entire app without prop drilling
- **Implementation**: `AuthContext.tsx`

```tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**Key Learning Points**:
- Prevents "prop drilling" (passing props through many layers)
- Provider wraps app to make context available to all components
- Use custom hooks to access context safely

---

### 3. **Higher-Order Components (HOC) & Protected Routes**

#### ProtectedRoute Component
- **Purpose**: Guard routes that require authentication or specific roles
- **Implementation**: Redirects unauthorized users to login

```tsx
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
```

**Key Learning Points**:
- HOCs wrap components to add functionality
- Pattern for authorization/authentication
- Prevents rendering protected content before checks complete

---

### 4. **React Router v7 - Advanced Routing**

#### Route Configuration
- **Used for**: Creating navigable app structure
- **Example**: Routes defined with different roles

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute requiredRoles={['USER']}>
    <UserDashboard />
  </ProtectedRoute>} />
  
  <Route element={<ProtectedRoute requiredRoles={['CATTERY_ADMIN']}>
    <CatteryDashboard />
  </ProtectedRoute>} />
</Routes>
```

**Key Learning Points**:
- Use `<Navigate>` for redirects
- `useNavigate()` hook for programmatic navigation
- `useParams()` for route parameters
- Protect routes with role-based access

---

### 5. **Component Composition & Reusability**

#### CatCard Component
- **Purpose**: Reusable card for displaying cat info
- **Used in**: Browse Cats, Dashboard pages
- **Pattern**: Props-based configuration

```tsx
interface CatCardProps {
  cat: Cat;
}

export const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  // Component logic
};
```

**Key Learning Points**:
- Props make components reusable
- TypeScript interfaces for prop validation
- Extract repeated UI patterns into components
- Use `group` and `group-hover` for parent-child interactions

#### ApplicationCard Component
- **Purpose**: Display application status and info
- **Reuses pattern**: Same approach as CatCard

---

### 6. **Form Handling & Validation**

#### Controlled Components
- **Used for**: Managing form inputs with React state
- **Example**: Login & Register forms

```tsx
const [email, setEmail] = useState('');

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Key Learning Points**:
- Value comes from state, not DOM
- onChange handler updates state
- React becomes "single source of truth" for form data

#### Form Submission
- **Pattern**: Validate → API call → Handle response

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await authAPI.login(email, password);
    navigate('/dashboard');
  } catch (error) {
    setError('Login failed');
  }
};
```

---

### 7. **Async Operations & API Integration**

#### API Calls with Axios
- **Used for**: Making HTTP requests
- **Centralized config**: `api/config.ts`

```tsx
const { data } = await catAPI.getAllCats();
const response = await applicationAPI.applyForCat(catId, formData);
```

**Key Learning Points**:
- Axios simplifies HTTP requests
- Centralize API configuration for consistency
- Use async/await for cleaner code
- Always handle errors with try/catch

#### Request Interceptors
- **Purpose**: Automatically add auth tokens to requests

```tsx
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 8. **Type Safety with TypeScript**

#### Type Definitions
- **Purpose**: Prevent runtime errors with compile-time checks
- **Example**: Cat, User, Application types

```tsx
interface Cat {
  id: number;
  name: string;
  breed: string;
  age_months: number;
  gender: 'MALE' | 'FEMALE';
  type: 'ADOPTION' | 'SALE';
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED';
  price?: number;
  description?: string;
}
```

**Key Learning Points**:
- Interfaces define object structures
- Union types (`'MALE' | 'FEMALE'`) for limited options
- Optional properties with `?`
- Catch type errors before runtime

#### Generic Types
- **Used for**: Flexible, reusable types

```tsx
const apiClient: AxiosInstance = axios.create({...});
const response: AxiosResponse<Cat[]> = await apiClient.get('/cats');
```

---

### 9. **Conditional Rendering Patterns**

#### Ternary Operator
```tsx
{isLoading ? <LoadingSpinner /> : <CatList />}
```

#### Logical AND (`&&`)
```tsx
{isAuthenticated && <LogoutButton />}
```

#### Multiple Conditions
```tsx
{status === 'PENDING' && <WarningBadge />}
{status === 'APPROVED' && <SuccessBadge />}
{status === 'REJECTED' && <ErrorBadge />}
```

---

### 10. **Performance Optimization**

#### useCallback Hook
- **Purpose**: Memoize callback functions to prevent unnecessary re-renders
- **When to use**: Passing callbacks to optimized child components

```tsx
const handleDelete = useCallback((id: number) => {
  deleteItem(id);
}, [deleteItem]);
```

#### Key Performance Concepts
- React re-renders when state/props change
- Expensive operations (API calls) should be in useEffect
- Split large components into smaller ones
- Avoid inline object/array creation in JSX

---

### 11. **Error Handling Patterns**

#### Try/Catch in Async Functions
```tsx
try {
  const data = await apiCall();
  setData(data);
} catch (error) {
  setError('Failed to load data');
} finally {
  setIsLoading(false);
}
```

#### Error Boundaries (Class Components)
- For catching errors in component tree
- Prevents entire app from crashing

#### Error Display in UI
```tsx
{error && (
  <div className="bg-red-50 border border-red-300 p-4 rounded-2xl">
    {error}
  </div>
)}
```

---

### 12. **Styling with Tailwind CSS**

#### Responsive Design
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
```

#### Group Hover Effects
```tsx
<div className="group">
  <span className="group-hover:text-blue-600">Text</span>
</div>
```

#### Gradient Backgrounds
```tsx
className="bg-gradient-to-r from-blue-600 to-blue-800"
```

---

## Architecture Decisions

### 1. Centralized API Layer
- **File**: `api/endpoints.ts`
- **Benefits**: 
  - Single point to manage all API calls
  - Easy to update endpoints
  - Consistent error handling

### 2. Context for Auth
- **File**: `contexts/AuthContext.tsx`
- **Prevents**: Prop drilling authentication state through entire app
- **Allows**: Any component to check auth status with `useAuth()`

### 3. Protected Routes
- **File**: `components/ProtectedRoute.tsx`
- **Ensures**: Unauthorized users can't access protected pages
- **Supports**: Role-based access control

### 4. Modular File Structure
```
src/
├── components/       # Reusable components
├── pages/           # Page-level components (full-page views)
├── hooks/           # Custom React hooks
├── contexts/        # Context providers (global state)
├── api/             # API integration
├── types/           # TypeScript type definitions
├── layouts/         # Layout wrappers
└── routes/          # Route configuration
```

---

## Advanced Patterns to Study

### 1. **Render Props Pattern**
- Alternative to HOCs for sharing logic
- Pass a function as a prop that returns JSX

### 2. **Compound Components**
- Components that work together
- Example: `<Menu>` and `<MenuItem>` components

### 3. **Container/Presentational Pattern**
- Container handles logic and data fetching
- Presentational components handle rendering
- See: Most page components vs CatCard

### 4. **Custom Hooks for Logic**
- Extract component logic into hooks
- Example: `useAuth`, `useForm`, `useFetch`

---

## Testing Concepts

### What to Test
1. **Component Rendering**: Does it render without errors?
2. **State Updates**: Does state change correctly?
3. **API Integration**: Does data load correctly?
4. **Navigation**: Do links navigate correctly?
5. **Authentication**: Are protected routes protected?

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing

---

## Best Practices Demonstrated

✅ **Component Composition**: Break UI into small, reusable pieces  
✅ **Custom Hooks**: Extract logic for reusability  
✅ **TypeScript**: Type-safe code prevents bugs  
✅ **Error Handling**: Graceful error displays  
✅ **Loading States**: Show feedback during async operations  
✅ **Form Validation**: Collect data safely from users  
✅ **Protected Routes**: Authorization at routing level  
✅ **Responsive Design**: Mobile-first styling  
✅ **Accessibility**: ARIA labels, semantic HTML  
✅ **Code Organization**: Clear file structure  

---

## Resources for Further Learning

### Official Documentation
- [React Docs](https://react.dev)
- [React Router v7](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

### Advanced Topics
- State Management (Redux, Zustand, Recoil)
- Server State Management (React Query, SWR)
- Animation Libraries (Framer Motion)
- Form Libraries (React Hook Form, Formik)
- Testing (Jest, React Testing Library, Cypress)

---

## Conclusion

PurrQueue demonstrates a modern React application using:
- ✅ Functional components with hooks
- ✅ TypeScript for type safety
- ✅ Context API for state management
- ✅ Protected routes for authorization
- ✅ Centralized API integration
- ✅ Responsive design with Tailwind CSS
- ✅ Clean, organized code structure

Study this codebase to understand how professional React applications are built!
