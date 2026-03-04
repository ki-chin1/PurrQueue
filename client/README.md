# PurrQueue Frontend - React Application

## Overview

A modern React-based frontend for the PurrQueue cat adoption/sale platform. Built with **Vite**, **React 19**, **React Router 7**, **TypeScript**, **Tailwind CSS**, and **Context API**.

## 🏗️ Architecture

### Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Scalability**: Folder structure organized by feature (pages, components, hooks, etc.)
3. **Type Safety**: Full TypeScript with comprehensive interfaces
4. **Reusability**: Shared components, hooks, and utilities
5. **Centralized Configuration**: API endpoints and routes defined in one place

### Tech Stack

- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **React Router 7.0.2** - Client-side routing
- **Axios 1.7.7** - HTTP client with interceptors
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Context API** - Global state management (authentication)

## 📁 Folder Structure

```
src/
├── components/          # Reusable React components
│   ├── common/         # Shared components (Navbar, etc)
│   ├── ProtectedRoute.tsx
│   ├── CatCard.tsx
│   └── ApplicationCard.tsx
├── pages/              # Page components organized by role
│   ├── public/         # Public pages (Home, Login, Register, etc)
│   ├── user/           # User dashboard pages
│   └── cattery/        # Cattery owner pages
├── layouts/            # Layout wrappers for different user types
├── contexts/           # Context API for global state
├── hooks/              # Custom React hooks
├── api/                # API configuration and endpoints
├── types/              # TypeScript interfaces and types
├── routes/             # Centralized route configuration
└── utils/              # Utility functions
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. User signs up or logs in
2. Backend returns JWT token (stored in localStorage)
3. Token automatically attached to all API requests via Axios interceptors
4. 401 errors redirect to login page
5. User logout clears token and redirects to home

### Role-Based Access Control

Three user roles supported:
- **USER**: Regular users who adopt/buy cats
- **CATTERY_ADMIN**: Cattery owners who manage cats and review applications
- **ADMIN**: System administrators

Protected routes use `<ProtectedRoute>` component with `requiredRoles` prop.

## 🚀 Getting Started

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost/purrqueue/server" > .env

# Start development server
npm run dev
```

### Development

- Dev server runs at `http://localhost:5173`
- HMR (Hot Module Replacement) enabled
- TypeScript checks on save

## 🔧 Configuration

### Environment Variables (`.env`)

```
VITE_API_URL=http://localhost/purrqueue/server
```

## 📄 Pages

### Public Pages
- **Home** (`/`) - Landing page
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User signup
- **Browse Cats** (`/browse-cats`) - List all cats
- **Cat Detail** (`/cat/:id`) - Detailed cat view

### User Pages (Protected)
- **Dashboard** (`/user/dashboard`) - View applications
- **Apply Form** (`/user/apply/:catId`) - Apply for cat
- **Application Detail** (`/user/application/:id`) - Application status

### Cattery Pages (Protected)
- **Dashboard** (`/cattery/dashboard`) - Overview
- **Manage Cats** (`/cattery/manage-cats`) - CRUD cats
- **Manage Applications** (`/cattery/manage-applications`) - Review apps

## 🔌 API Integration

Centralized API configuration with:
- Automatic JWT injection
- Error handling with 401 redirect
- 10 second timeout

## 🎨 Layouts

- **PublicLayout** - For unauthenticated users
- **UserLayout** - For regular users
- **CatteryLayout** - For cattery owners

## 📊 State Management

Uses **Context API** with localStorage persistence for:
- User authentication
- Role-based access control
- Token management

## 🧩 Reusable Components

- **CatCard** - Cat information display
- **ApplicationCard** - Application details
- **ProtectedRoute** - Route protection with roles
- **Navbar** - Navigation bar

## 🚦 Error Handling

- Global API error handling via interceptors
- User-friendly error messages
- 401 errors redirect to login
- Form validation errors

## 🎨 Styling

- **Tailwind CSS** for styling
- **Responsive Design** - Mobile-first approach
- Consistent color scheme

## 📱 Responsive Design

- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

## ✅ Features

- ✅ User authentication (signup/login/logout)
- ✅ Role-based access control
- ✅ Browse cats with filtering
- ✅ Detailed cat information with images
- ✅ User applications management
- ✅ Cattery dashboard with CRUD operations
- ✅ Responsive mobile design
- ✅ Type-safe TypeScript throughout

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## 🏗️ Production Build

```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

Generates optimized bundle in `dist/` folder.
