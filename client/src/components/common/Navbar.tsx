import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          PurrQueue
        </Link>

        <div className="flex gap-4 sm:gap-6 items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/browse-cats" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Browse Cats
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Sign In
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/browse-cats" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Browse
              </Link>

              {user?.role === 'USER' && (
                <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Dashboard
                </Link>
              )}

              {(user?.role === 'CATTERY_ADMIN' || user?.role === 'ADMIN') && (
                <Link to="/cattery/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Manage
                </Link>
              )}

              <div className="flex gap-3 items-center border-l border-gray-200 pl-4">
                <span className="text-sm text-gray-700 font-medium hidden sm:inline">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
