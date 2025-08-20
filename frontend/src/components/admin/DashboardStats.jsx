import { useGetDashboardStatsQuery } from '../../store/api/dashboardApi';
import Loader from '../shared/Loader';

const DashboardStats = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const stats = data?.data || {};
  
  if (error) {
    console.error('Dashboard stats error:', error);
    // Show error state with zeros instead of hiding
  }

  if (isLoading) return <Loader className="py-4" />;

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
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
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