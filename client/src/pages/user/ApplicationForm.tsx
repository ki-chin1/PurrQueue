import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, catAPI } from '../../api/endpoints';
import type { Cat } from '../../types';

const ApplicationForm: React.FC = () => {
  const { catId } = useParams<{ catId: string }>();
  const navigate = useNavigate();

  const [cat, setCat] = useState<Cat | null>(null);
  const [formData, setFormData] = useState({
    housing_type: 'APARTMENT',
    experience: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCat = async () => {
      if (!catId) return;
      try {
        const { data: catData } = await catAPI.getCatById(parseInt(catId));
        setCat(catData);
      } catch (err: any) {
        setError('Failed to load cat information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCat();
  }, [catId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId) return;

    setIsSubmitting(true);
    setError('');

    try {
      await applicationAPI.applyForCat(parseInt(catId), {
        housing_type: formData.housing_type as 'RENT' | 'OWN',
        experience: formData.experience,
        message: formData.message,
      });
      navigate('/user/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cat || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl font-medium mb-6">
            {error || 'Cat not found'}
          </div>
          <button
            onClick={() => navigate('/browse-cats')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Apply for {cat.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {cat.breed} • {cat.gender} • {cat.age_months} months old
          </p>
        </div>

        {error && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Housing Type</label>
            <select
              name="housing_type"
              value={formData.housing_type}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white font-medium"
              required
              disabled={isSubmitting}
            >
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="FARM">Farm</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
              Experience with Cats
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Tell us about your experience with cats..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Why would you like to adopt/buy this cat?..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
