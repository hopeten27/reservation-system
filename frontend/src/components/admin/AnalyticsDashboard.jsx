import { useState } from 'react';
import { useGetAnalyticsQuery } from '../../store/api/adminApi';
import Loader from '../shared/Loader';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { data, isLoading } = useGetAnalyticsQuery(timeRange);
  const analytics = data?.data || {};

  if (isLoading) return <Loader />;

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center space-x-2">
              <div className={`h-2 bg-${color}-600 rounded`} style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}px` }}></div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={analytics.totalBookings || 0}
          change={analytics.bookingsChange}
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Revenue"
          value={`$${analytics.totalRevenue || 0}`}
          change={analytics.revenueChange}
          icon="💰"
          color="green"
        />
        <StatCard
          title="New Users"
          value={analytics.newUsers || 0}
          change={analytics.usersChange}
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Avg. Rating"
          value={analytics.avgRating || '0.0'}
          change={analytics.ratingChange}
          icon="⭐"
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Popular Services"
          data={analytics.popularServices || []}
          color="blue"
        />
        <SimpleChart
          title="Revenue by Service"
          data={analytics.revenueByService || []}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Booking Status Distribution"
          data={analytics.bookingStatus || []}
          color="purple"
        />
        <SimpleChart
          title="Peak Hours"
          data={analytics.peakHours || []}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(analytics.recentActivity || []).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-lg">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <div className="text-sm text-gray-600">{activity.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;