import { useGetDashboardStatsQuery } from '../../store/api/dashboardApi';
import Loader from '../shared/Loader';

const DashboardStats = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const stats = data?.data || {};
  
  if (error) {
    console.error('Dashboard stats error:', error);
  }

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const statCards = [
    {
      title: 'Total Bookings',
      value: error ? 'Error' : (stats.totalBookings || 0),
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      title: 'Revenue',
      value: error ? 'Error' : `$${stats.totalRevenue || 0}`,
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Active Services',
      value: error ? 'Error' : (stats.activeServices || 0),
      icon: '🎯',
      color: 'bg-purple-500'
    },
    {
      title: 'Today\'s Appointments',
      value: error ? 'Error' : (stats.todayBookings || 0),
      icon: '⏰',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3 text-white text-2xl mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;