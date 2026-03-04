#!/bin/bash

# PurrQueue Frontend - File Structure Setup
# Run this script to verify all files are in place

echo "🔍 Checking PurrQueue Frontend Structure..."
echo ""

# Define the directory structure and files needed
CLIENT_DIR="$(pwd)"

# Array of files that need to exist
declare -a FILES=(
    "src/api/client.ts"
    "src/context/AuthContext.tsx"
    "src/components/ProtectedRoute.tsx"
    "src/components/common/CatCard.tsx"
    "src/components/layout/PublicLayout.tsx"
    "src/components/layout/UserDashboardLayout.tsx"
    "src/components/layout/CatteryDashboardLayout.tsx"
    "src/pages/public/HomePage.tsx"
    "src/pages/public/LoginPage.tsx"
    "src/pages/public/RegisterPage.tsx"
    "src/pages/public/BrowseCatsPage.tsx"
    "src/pages/public/CatDetailPage.tsx"
    "src/pages/user/UserDashboardPage.tsx"
    "src/pages/user/UserApplicationsPage.tsx"
    "src/pages/user/ApplyFormPage.tsx"
    "src/pages/cattery/CatteryDashboardPage.tsx"
    "src/pages/cattery/ManageCatsPage.tsx"
    "src/pages/cattery/ManageApplicationsPage.tsx"
    "src/types/index.ts"
    "src/App.tsx"
    "src/main.tsx"
    "src/index.css"
    ".env.example"
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    "tsconfig.node.json"
    "tailwind.config.ts"
    "postcss.config.js"
)

echo "✅ Checking files..."
MISSING=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ MISSING: $file"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
if [ $MISSING -eq 0 ]; then
    echo "✅ All files present!"
    echo ""
    echo "📦 Ready to install dependencies:"
    echo "   npm install"
    echo ""
    echo "🚀 Then start development server:"
    echo "   npm run dev"
else
    echo "⚠️  $MISSING files missing!"
    echo ""
    echo "Make sure all files are created in the correct locations."
fi
