import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../api/endpoints';
import type { Application } from '../../types';
import ApplicationCard from '../../components/ApplicationCard';

const UserDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await applicationAPI.getMyApplications();
      setApplications(data.data);
    } catch (err: any) {
      setError('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              My Applications
            </h1>
            <p className="text-gray-600">Track and manage your cat applications</p>
          </div>
          <button
            onClick={() => navigate('/browse-cats')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold whitespace-nowrap"
          >
            Browse More Cats
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">You haven't applied for any cats yet.</p>
            <button
              onClick={() => navigate('/browse-cats')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onViewDetails={() => navigate(`/user/application/${app.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
