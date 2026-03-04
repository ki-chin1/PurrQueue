import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../api/endpoints';
import type { Application } from '../../types';

const UserApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        const { data } = await applicationAPI.getApplicationById(parseInt(id));
        setApplication(data);
      } catch (err: any) {
        setError('Failed to load application.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

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

  if (!application || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl font-medium mb-6">
            {error || 'Application not found'}
          </div>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      case 'APPROVED':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'REJECTED':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors duration-200"
        >
          <span className="text-lg">←</span> Back to Dashboard
        </button>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Application for {application.cat?.name}
                </h1>
                <p className="text-blue-100">
                  {application.cat?.breed} • {application.cat?.age_months} months old
                </p>
              </div>
              <span className={`px-6 py-3 rounded-full font-bold shadow-lg whitespace-nowrap ${getStatusGradient(
                application.status
              )}`}>
                {application.status}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-gray-200">
                <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Application Date</p>
                <p className="text-xl font-semibold text-gray-900">
                  {new Date(application.created_at || '').toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-gray-200">
                <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Housing Type</p>
                <p className="text-xl font-semibold text-gray-900">{application.housing_type}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Your Experience with Cats</h2>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{application.experience}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Your Message</h2>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{application.message}</p>
              </div>
            </div>

            {application.status === 'PENDING' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-6 rounded-2xl">
                <p className="text-amber-900 font-semibold text-lg">
                  Your application is being reviewed.
                </p>
                <p className="text-amber-800 mt-2">
                  The cattery owner will respond soon!
                </p>
              </div>
            )}

            {application.status === 'APPROVED' && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 p-6 rounded-2xl">
                <p className="text-emerald-900 font-bold text-lg">
                  Your application has been approved!
                </p>
                <p className="text-emerald-800 mt-2">
                  Please contact the cattery owner to arrange a meeting or finalize the transaction.
                </p>
              </div>
            )}

            {application.status === 'REJECTED' && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 p-6 rounded-2xl">
                <p className="text-red-900 font-bold text-lg">
                  Your application has been declined.
                </p>
                <p className="text-red-800 mt-2">
                  You can browse other available cats or contact the cattery for more information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplicationDetail;
