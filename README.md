# PurrQueue

A full-stack cat adoption and sales platform featuring a modern React frontend with TypeScript and a robust PHP backend with secure API endpoints.


---

## Project Highlights

- **Full-Stack Architecture:** Modern React + TypeScript frontend with clean component structure
- **Secure Backend:** PHP REST API with PDO prepared statements and comprehensive error handling
- **Role-Based Access Control:** Separate dashboards for users, catteries, and admins
- **Type-Safe:** Complete TypeScript implementation throughout the frontend
- **Production-Ready:** Optimized build process with Vite, Tailwind CSS for styling
- **Clean Code:** Repository pattern for data access, proper separation of concerns

---

## Tech Stack

### Frontend
- **React 19** with TypeScript for type-safe component development
- **React Router** for client-side navigation and protected routes
- **Tailwind CSS** for responsive, utility-first styling
- **Axios** with auth interceptors for secure API communication
- **Context API** for global state management

### Backend
- **PHP 8+** with modern OOP patterns
- **MySQL** for relational data storage
- **Repository Pattern** for clean data access layer
- **RESTful API** design with proper HTTP status codes

---

## Features

### For Users
- Browse available cats with detailed information
- Apply for adoption or purchase
- Track application status
- View personal dashboard
- Secure login/registration system

### For Catteries
- Manage cat listings (add, edit, delete)
- Process adoption/sale applications
- Track inventory and status
- Dedicated cattery dashboard

### Technical Features
- **Authentication:** Token-based session management
- **Authorization:** Role-based route protection
- **Error Handling:** Graceful error messages and proper HTTP status codes
- **Security:** CORS handling, input validation, prepared statements
- **Performance:** Optimized API responses, lazy-loaded components

---

## Project Structure

```
purrqueue/
├── client/                          # React TypeScript frontend
│   ├── src/
│   │   ├── api/                    # Axios client & endpoints
│   │   ├── components/             # Reusable React components
│   │   ├── contexts/               # Auth context (Redux-lite)
│   │   ├── pages/                  # Route pages
│   │   │   ├── public/            # Public pages (Home, Login, Register, Browse)
│   │   │   ├── user/              # User dashboard pages
│   │   │   └── cattery/           # Cattery management pages
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── App.tsx                # Router configuration
│   │   └── main.tsx               # Entry point
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── vite.config.ts             # Vite build configuration
│   └── package.json
│
├── server/                          # PHP REST API backend
│   ├── api/                        # API endpoints
│   │   ├── cats.php              # Cat management
│   │   ├── applications.php       # Application handling
│   │   ├── login.php             # Authentication
│   │   └── ...                   # Other endpoints
│   ├── config/                    # Database configuration
│   ├── src/                       # Repository pattern classes
│   │   ├── CatRepository.php
│   │   ├── UserRepository.php
│   │   └── ...
│   └── database.php              # Database connection
│
└── README.md                        # This file
```

---

## API Endpoints Overview

### Cat Management
- `GET /api/cats.php` - Get all cats
- `GET /api/cats.php?id={id}` - Get single cat
- `POST /api/cats.php` - Create cat (cattery only)
- `PUT /api/cats.php` - Update cat (cattery only)
- `DELETE /api/cats.php?id={id}` - Delete cat (cattery only)

### Authentication
- `POST /api/signup.php` - User registration
- `POST /api/login.php` - User login
- `GET /api/me.php` - Get current user profile
- `POST /api/logout.php` - Logout

### Applications
- `GET /api/my-applications.php` - User's applications
- `POST /api/apply-cat.php` - Submit application
- `GET /api/applications.php` - Cattery's received applications

### Complete API documentation available in [server/](server/) folder

---

## Key Implementation Details

### Frontend Patterns
- **Protected Routes:** Components wrap routes to enforce authentication
- **Custom Hooks:** `useAuth()` hook for accessing auth context
- **Axios Interceptors:** Automatic token injection and error handling
- **TypeScript Interfaces:** Type-safe API responses and component props

### Backend Patterns  
- **Repository Pattern:** Data access abstraction layer
- **Service Classes:** Business logic separation
- **RESTful Design:** Proper HTTP methods and status codes

