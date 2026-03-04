import React, { useState, useEffect } from 'react';
import { catAPI } from '../../api/endpoints';
import type { Cat } from '../../types';
import CatCard from '../../components/CatCard';

const BrowseCats: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await catAPI.getAllCats();
      setCats(data.data);
    } catch (err: any) {
      setError('Failed to load cats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cats based on selected filters
  const filteredCats = cats.filter((cat) => {
    if (selectedType !== 'ALL' && cat.type !== selectedType) return false;
    if (selectedStatus !== 'ALL' && cat.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Browse Cats
          </h1>
          <p className="text-gray-600 text-lg">Find your perfect feline companion</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">!</span>
            <div>
              <p className="font-semibold">Unable to load cats</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="ADOPTION">For Adoption</option>
                <option value="SALE">For Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="ADOPTED">Adopted</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedType('ALL');
                setSelectedStatus('ALL');
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-blue-600">{filteredCats.length}</span> of <span className="text-blue-600">{cats.length}</span> cats
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading amazing cats...</p>
            </div>
          </div>
        ) : filteredCats.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-600 text-lg">No cats match your filters. Try adjusting them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCats;
