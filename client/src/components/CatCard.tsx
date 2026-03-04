import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cat } from '../types';

interface CatCardProps {
  cat: Cat;
}

export const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/cat/${cat.id}`)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer hover:border-blue-200"
    >
      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-300 relative overflow-hidden">
        <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">Cat</span>
        {cat.status === 'AVAILABLE' && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Available
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {cat.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-5">
          {cat.breed && <p className="font-medium text-gray-700">Breed: {cat.breed}</p>}
          {cat.age_months && <p>Age: {cat.age_months} months</p>}
          <p>Gender: {cat.gender}</p>
          {cat.color && <p>Color: {cat.color}</p>}
        </div>

        <div className="mb-5 pb-5 border-t border-gray-100 pt-5">
          <div className="flex justify-between items-center">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {cat.type === 'ADOPTION' ? 'For Adoption' : 'For Sale'}
            </span>
            {cat.type === 'SALE' && cat.price && (
              <span className="text-lg font-bold text-blue-600">${typeof cat.price === 'string' ? parseFloat(cat.price).toLocaleString('en-US') : cat.price.toLocaleString('en-US')}</span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cat/${cat.id}`);
          }}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CatCard;
