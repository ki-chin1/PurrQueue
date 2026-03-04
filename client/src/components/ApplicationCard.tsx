import React from 'react';
import type { Application } from '../types';

interface ApplicationCardProps {
  application: Application;
  onApprove?: (appId: number) => void;
  onReject?: (appId: number) => void;
  onViewDetails?: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {application.cat?.name || `Cat #${application.cat_id}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Applied by {application.user?.name} • {new Date(application.created_at || '').toLocaleDateString()}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100 text-sm">
        {application.housing_type && (
          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase">Housing Type</p>
            <p className="text-gray-900 font-medium mt-1">{application.housing_type}</p>
          </div>
        )}
      </div>

      {application.message && (
        <div className="mb-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Application Message</p>
          <p className="text-sm text-gray-700">{application.message}</p>
        </div>
      )}

      {application.experience && (
        <div className="mb-5 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Experience</p>
          <p className="text-sm text-gray-700">{application.experience}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
          >
            View Details
          </button>
        )}
        {onApprove && application.status === 'PENDING' && (
          <button
            onClick={() => onApprove(application.id)}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Approve
          </button>
        )}
        {onReject && application.status === 'PENDING' && (
          <button
            onClick={() => onReject(application.id)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
