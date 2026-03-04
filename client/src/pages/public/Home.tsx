import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
            PurrQueue
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your trusted platform for cat adoption and sales management. Find your perfect feline companion or manage your cattery with ease.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/browse-cats"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg"
              >
                Browse Cats
              </Link>
              <Link
                to="/register"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <Link
              to="/browse-cats"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg"
            >
              Browse Cats
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Discover Cats</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse hundreds of beautiful cats available for adoption or purchase. Filter by type, status, and more.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 text-2xl">
              📋
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Applications</h3>
            <p className="text-gray-600 leading-relaxed">
              Submit applications with detailed information about your home and experience with cats.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-2xl">
              🏠
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Cattery</h3>
            <p className="text-gray-600 leading-relaxed">
              For catteries: manage cats, view applications, and make informed decisions easily.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-gray-600">Cats Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-600">Happy Adoptions</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                100+
              </div>
              <p className="text-gray-600">Active Catteries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
