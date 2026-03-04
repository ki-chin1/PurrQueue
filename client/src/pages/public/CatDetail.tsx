import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catAPI, imageAPI } from '../../api/endpoints';
import type { Cat, CatImage } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const CatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cat, setCat] = useState<Cat | null>(null);
  const [images, setImages] = useState<CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchCatDetails = async () => {
      if (!id) return;
      try {
        const { data: catData } = await catAPI.getCatById(parseInt(id));
        setCat(catData);

        const { data: imagesData } = await imageAPI.getCatImages(parseInt(id));
        setImages(imagesData.data || []);
      } catch (err: any) {
        setError('Failed to load cat details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatDetails();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/user/apply/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading cat details...</p>
        </div>
      </div>
    );
  }

  if (!cat || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl font-medium mb-6">
            {error || 'Cat not found'}
          </div>
          <button
            onClick={() => navigate('/browse-cats')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Back to Browse Cats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/browse-cats')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors duration-200"
        >
          <span className="text-lg">←</span> Back to Browse Cats
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-lg">
              {images.length > 0 && selectedImageIndex < images.length ? (
                <img
                  src={images[selectedImageIndex].image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 text-lg">No images available</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 transition-all duration-200 ${
                      idx === selectedImageIndex
                        ? 'border-blue-600 ring-2 ring-blue-400 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${cat.name} ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                {cat.name}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md ${
                  cat.type === 'ADOPTION' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}>
                  {cat.type === 'ADOPTION' ? 'For Adoption' : 'For Sale'}
                </span>
                <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md ${
                  cat.status === 'AVAILABLE'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : cat.status === 'PENDING'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                    : 'bg-gradient-to-r from-slate-500 to-slate-600'
                }`}>
                  {cat.status}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Breed</p>
                  <p className="text-lg font-semibold text-gray-900">{cat.breed}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Age</p>
                  <p className="text-lg font-semibold text-gray-900">{cat.age_months} months</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Gender</p>
                  <p className="text-lg font-semibold text-gray-900">{cat.gender}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Color</p>
                  <p className="text-lg font-semibold text-gray-900">{cat.color}</p>
                </div>
              </div>
            </div>

            {cat.description && (
              <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-gray-100">
                <h2 className="text-lg font-bold mb-3 text-gray-800">About {cat.name}</h2>
                <p className="text-gray-700 leading-relaxed">{cat.description}</p>
              </div>
            )}

            {cat.type === 'SALE' && cat.price && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">Price</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ${cat.price}
                </p>
              </div>
            )}

            {cat.status === 'AVAILABLE' && (
              <button
                onClick={handleApplyClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
              </button>
            )}

            {cat.status !== 'AVAILABLE' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                <p className="text-amber-900 font-semibold text-center">
                  This cat is no longer available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetail;
