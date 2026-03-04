import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../api/endpoints';
import type { Application } from '../../types';

const ManageApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Get my cattery applications (applications for cats in my cattery)
      // Using getCatApplications for all applications submitted to this cattery
      const { data: appsData } = await applicationAPI.getMyApplications();
      setApplications(appsData.data);
    } catch (err: any) {
      setError('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (_id: number) => {
    // This would require a backend endpoint to update application status
    try {
      // await applicationAPI.updateApplicationStatus(_id, 'APPROVED');
      // await fetchApplications();
      alert('Application status update feature coming soon');
    } catch (err: any) {
      setError('Failed to approve application.');
    }
  };

  const handleReject = async (_id: number) => {
    // This would require a backend endpoint to update application status
    try {
      // await applicationAPI.updateApplicationStatus(_id, 'REJECTED');
      // await fetchApplications();
      alert('Application status update feature coming soon');
    } catch (err: any) {
      setError('Failed to reject application.');
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8">
          Manage Applications
        </h1>

        {error && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl mb-6 font-medium">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 mb-6">
          <p className="text-blue-900 font-medium">
            <span className="font-bold">Note:</span> To view and manage applications, please select a cat from "Manage Cats" 
            to see applications for that specific cat.
          </p>
        </div>

        <p className="text-gray-600 font-medium mb-6">
          Showing <span className="text-blue-600 font-bold">{filteredApplications.length}</span> application{filteredApplications.length !== 1 ? 's' : ''}
        </p>

        {filteredApplications.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg font-medium">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1">Applicant</p>
                      <p className="text-lg font-semibold text-gray-900">{app.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1">Cat</p>
                      <p className="text-lg font-semibold text-gray-900">{app.cat?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(app.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1">Status</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white shadow-md ${
                        app.status === 'PENDING'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : app.status === 'APPROVED'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>

                
                <div className="px-6 py-6 space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Housing Type</p>
                    <p className="text-gray-900 font-semibold">{app.housing_type}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Experience</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{app.experience}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">Message</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{app.message}</p>
                  </div>
                </div>

                {app.status === 'PENDING' && (
                  <div className="border-t border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
