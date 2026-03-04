# PurrQueue Frontend - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- PHP backend running at `/api` endpoints

### Step 1: Install Dependencies
```bash
cd client
npm install
```

### Step 2: Configure API URL
```bash
# Create .env file
echo "VITE_API_URL=http://localhost/purrqueue/server" > .env

# For XAMPP, use:
# VITE_API_URL=http://localhost/purrqueue/server
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

---

## 🧪 Testing the Application

### 1. Test Public Pages (No Auth Required)
- [ ] Visit home page: `http://localhost:5173/`
- [ ] Browse cats: `/browse-cats`
- [ ] Click on a cat to see details: `/cat/1`

### 2. Test User Signup
- [ ] Go to `/register`
- [ ] Enter name, email, password
- [ ] Select role: "Regular User (Adopt/Buy)"
- [ ] Click Register
- [ ] Should redirect to home as logged-in user

### 3. Test User Features
- [ ] Go to `/browse-cats`
- [ ] Click "Apply Now" on any cat
- [ ] Fill out application form
- [ ] View applications at `/user/dashboard`

### 4. Test Cattery Admin Features
- [ ] Logout and register as "Cattery Owner (Manage Cats)"
- [ ] Go to `/cattery/dashboard`
- [ ] Click "Manage Cats"
- [ ] Add a new cat: Name, Breed, Age, Gender, Color, Type
- [ ] Edit/Delete existing cats
- [ ] View `/cattery/manage-applications` (will show placeholder)

### 5. Test Authentication
- [ ] Login with your test user
- [ ] Check localStorage for token: `Open DevTools → Application → Local Storage`
- [ ] Try logout - should redirect to home and clear token

---

## 📁 Important Files

### Configuration
- `.env` - Environment variables (API URL)
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Source Code
```
src/
├── main.tsx              # App entry point
├── App.tsx               # Main app component
├── index.css             # Global styles
└── ...other files...
```

### Pages Location
```
src/pages/
├── public/    # Home, Login, Register, Browse, Detail
├── user/      # Dashboard, Apply, Application Detail
└── cattery/   # Dashboard, Manage Cats, Manage Applications
```

---

## 🔑 Test Credentials

After registering, you can test with:

**User Account**
- Email: user@test.com
- Password: password123
- Role: USER

**Cattery Account**
- Email: cattery@test.com
- Password: password123
- Role: CATTERY_ADMIN

---

## 🐛 Common Issues & Solutions

### Issue: "API connection failed"
**Solution**: 
1. Check `.env` has correct API URL
2. Verify backend is running at `/api` path
3. Check browser console for actual error

### Issue: "Cannot find module" errors
**Solution**:
1. Delete `node_modules/` folder
2. Run `npm install` again
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Blank page after login"
**Solution**:
1. Open DevTools (F12)
2. Check Console for errors
3. Check if token is in localStorage
4. Try refreshing the page

### Issue: "404 on routes"
**Solution**:
1. Make sure dev server is running (`npm run dev`)
2. Check if browsing to correct URL
3. Vite dev server needs to be running

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 💻 Development Commands

```bash
# Start development server (auto-reload)
npm run dev

# Type check without building
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and fix code (if ESLint configured)
npm run lint
```

---

## 🗂️ Project Structure Overview

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Shared components (Navbar)
│   │   ├── CatCard.tsx
│   │   ├── ApplicationCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/            # Page components
│   │   ├── public/      # Public pages
│   │   ├── user/        # User pages
│   │   └── cattery/     # Cattery admin pages
│   ├── layouts/         # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # Context API
│   ├── api/             # API configuration
│   ├── types/           # TypeScript types
│   ├── routes/          # Route configuration
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── tailwind.config.js   # Tailwind config
```

---

## 🔐 Authentication Flow

```
1. User visits /register
2. Fills form and submits
3. Frontend calls /api/signup.php
4. Backend returns JWT token
5. Token stored in localStorage
6. Token auto-injected in all API requests
7. 401 error redirects to login
8. Logout clears token
```

---

## 🎯 Key Features Demo

### Browse & Search
1. Go to `/browse-cats`
2. Filter by Type (Adoption/Sale)
3. Filter by Status (Available/Pending/Adopted)
4. Click on cat card to see details

### User Application
1. Login as USER
2. Click "Apply Now" on any cat
3. Fill housing, experience, message
4. Submit application
5. View at `/user/dashboard`

### Cattery Management
1. Login as CATTERY_ADMIN
2. Add new cat with details
3. Edit cat information
4. Delete cats with confirmation
5. View applications for review

---

## 📚 Documentation Files

- **README.md** - Setup and overview
- **PROJECT_SUMMARY.md** - Complete feature list
- **ARCHITECTURE.md** - Design decisions and patterns
- **QUICK_START.md** - This file
- **Code Comments** - Architecture decisions in code

---

## 🚨 Troubleshooting Checklist

Before reporting an issue:

- [ ] Node modules installed? (`npm install`)
- [ ] .env file created with API URL?
- [ ] Backend running? (Check `/api` endpoints)
- [ ] Dev server running? (`npm run dev`)
- [ ] Port 5173 available? (Not blocked by firewall)
- [ ] Browser cache cleared? (Ctrl+Shift+Delete)
- [ ] Console has no errors? (F12 → Console)
- [ ] localStorage has token? (F12 → Application → localStorage)
- [ ] API URL correct? (Check .env file)

---

## 🔗 Useful Links

**Vite**
- Docs: https://vitejs.dev
- Config: https://vitejs.dev/config/

**React Router**
- Docs: https://reactrouter.com
- API: https://reactrouter.com/docs/en/main

**Tailwind CSS**
- Docs: https://tailwindcss.com
- Components: https://tailwindcss.com/docs/installation

**TypeScript**
- Docs: https://www.typescriptlang.org
- Handbook: https://www.typescriptlang.org/docs/handbook/

---

## 📞 Getting Help

1. **Check Documentation**: See README.md and ARCHITECTURE.md
2. **Browser Console**: F12 → Console tab for errors
3. **Network Tab**: F12 → Network to see API calls
4. **localStorage**: F12 → Application → localStorage to check token
5. **React DevTools**: Install React DevTools extension

---

## ✅ You're Ready!

Your PurrQueue frontend is now:
- ✅ Installed
- ✅ Configured
- ✅ Running
- ✅ Ready to test

**Happy coding!** 🐱

---

**Last Updated**: March 2, 2025  
**Version**: 1.0
