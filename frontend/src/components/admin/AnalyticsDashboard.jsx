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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Live updates</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {(analytics.recentActivity || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h4>
              <p className="text-gray-500">Activity will appear here as your business grows</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(analytics.recentActivity || []).map((activity, index) => {
                const getActivityColor = (type) => {
                  switch (type) {
                    case 'booking': return 'from-blue-500 to-blue-600';
                    case 'payment': return 'from-green-500 to-green-600';
                    case 'user': return 'from-purple-500 to-purple-600';
                    case 'service': return 'from-orange-500 to-orange-600';
                    default: return 'from-gray-500 to-gray-600';
                  }
                };
                
                const getActivityIcon = (type) => {
                  switch (type) {
                    case 'booking': return '📅';
                    case 'payment': return '💰';
                    case 'user': return '👤';
                    case 'service': return '🎯';
                    default: return '📊';
                  }
                };
                
                return (
                  <div key={index} className="group relative">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-md">
                      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-lg">{activity.icon || getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {activity.title}
                          </p>
                          {activity.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <p className="text-xs text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {activity.time}
                          </p>
                          {activity.location && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {activity.location}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.value}
                        </div>
                        {activity.change && (
                          <div className={`text-xs font-medium flex items-center justify-end mt-1 ${
                            activity.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <svg className={`w-3 h-3 mr-1 ${activity.change > 0 ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            {Math.abs(activity.change)}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Timeline connector */}
                    {index < (analytics.recentActivity || []).length - 1 && (
                      <div className="absolute left-10 top-16 w-0.5 h-4 bg-gradient-to-b from-gray-200 to-transparent"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;