import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { catAPI } from '../../api/endpoints';

const CatteryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCats: 0,
    availableCats: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: response } = await catAPI.getAllCats();
        const cats = response.data;

        const availableCats = cats.filter((c) => c.status === 'AVAILABLE').length;

        setStats({
          totalCats: cats.length,
          availableCats,
        });
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Manage Cats',
      description: 'Add, edit, or delete cats',
      icon: 'cat',
      action: () => navigate('/cattery/manage-cats'),
    },
    {
      title: 'Manage Applications',
      description: 'Review and respond to applications',
      icon: 'list',
      action: () => navigate('/cattery/manage-applications'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Cattery Dashboard
          </h1>
          <p className="text-gray-600">Manage your cats and applications</p>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-blue-100 text-sm font-semibold uppercase mb-2">Total Cats</p>
              <p className="text-5xl font-bold">{stats.totalCats}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-green-100 text-sm font-semibold uppercase mb-2">Available Now</p>
              <p className="text-5xl font-bold">{stats.availableCats}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-left hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 opacity-60">{action.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatteryDashboard;
