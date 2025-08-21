import { useState } from 'react';
import { useGetAnalyticsQuery } from '../../store/api/adminApi';
import Loader from '../shared/Loader';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { data, isLoading } = useGetAnalyticsQuery(timeRange);
  const analytics = data?.data || {};

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatCard = ({ title, value, change, icon, gradient, bgGradient }) => (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <svg className={`w-3 h-3 mr-1 ${change >= 0 ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {Math.abs(change)}%
              </div>
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-r ${gradient} rounded-xl p-4 text-white text-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ModernChart = ({ data, title, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`w-3 h-3 ${color} rounded-full`}></div>
      </div>
      <div className="space-y-4">
        {data?.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.value));
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={analytics.totalBookings || 0}
          change={analytics.bookingsChange}
          icon="📅"
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
        />
        <StatCard
          title="Revenue"
          value={`$${analytics.totalRevenue || 0}`}
          change={analytics.revenueChange}
          icon="💰"
          gradient="from-green-500 to-green-600"
          bgGradient="from-green-50 to-green-100"
        />
        <StatCard
          title="New Users"
          value={analytics.newUsers || 0}
          change={analytics.usersChange}
          icon="👥"
          gradient="from-purple-500 to-purple-600"
          bgGradient="from-purple-50 to-purple-100"
        />
        <StatCard
          title="Avg. Rating"
          value={analytics.avgRating || '0.0'}
          change={analytics.ratingChange}
          icon="⭐"
          gradient="from-orange-500 to-orange-600"
          bgGradient="from-orange-50 to-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModernChart
          title="Popular Services"
          data={analytics.popularServices || []}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <ModernChart
          title="Revenue by Service"
          data={analytics.revenueByService || []}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <ModernChart
          title="Booking Status"
          data={analytics.bookingStatus || []}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <ModernChart
          title="Peak Hours"
          data={analytics.peakHours || []}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>
        <div className="space-y-3">
          {(analytics.recentActivity || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No recent activity to display</p>
            </div>
          ) : (
            (analytics.recentActivity || []).map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                  {activity.value}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;