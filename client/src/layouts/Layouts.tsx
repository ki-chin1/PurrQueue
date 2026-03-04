import React from 'react';
import { Navbar } from '../components/common/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2026 PurrQueue - Cat Adoption & Sales Management System</p>
      </footer>
    </div>
  );
};

export const UserLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2026 PurrQueue - Cat Adoption & Sales Management System</p>
      </footer>
    </div>
  );
};

export const CatteryLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white p-6 hidden lg:block">
          <h2 className="text-xl font-bold mb-6">Dashboard Menu</h2>
          <nav className="space-y-3">
            <a href="/cattery/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">
              📊 Dashboard
            </a>
            <a href="/cattery/manage-cats" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Manage Cats
            </a>
            <a href="/cattery/manage-applications" className="block px-4 py-2 hover:bg-gray-700 rounded">
              📝 Manage Applications
            </a>
          </nav>
        </aside>

        <main className="flex-1 px-4 py-8">
          {children}
        </main>
      </div>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2026 PurrQueue - Cat Adoption & Sales Management System</p>
      </footer>
    </div>
  );
};
