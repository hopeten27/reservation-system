import { useState } from 'react';
import { useExportDataMutation } from '../../store/api/adminApi';
import Loader from '../shared/Loader';

const DataExport = () => {
  const [exportData, { isLoading }] = useExportDataMutation();
  const [filters, setFilters] = useState({
    type: 'bookings',
    format: 'csv',
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleExport = async (type, format) => {
    try {
      const result = await exportData({ 
        type, 
        format, 
        ...filters 
      }).unwrap();
      
      // Create download link
      const blob = new Blob([result.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Error handled by toast
    }
  };

  const exportOptions = [
    { 
      type: 'bookings', 
      label: 'Bookings Data', 
      description: 'Export all booking records with customer details',
      icon: '📅',
      color: 'blue'
    },
    { 
      type: 'users', 
      label: 'Users Data', 
      description: 'Export user accounts and profile information',
      icon: '👥',
      color: 'green'
    },
    { 
      type: 'services', 
      label: 'Services Data', 
      description: 'Export service listings and configurations',
      icon: '🎯',
      color: 'purple'
    },
    { 
      type: 'revenue', 
      label: 'Revenue Report', 
      description: 'Export financial data and revenue analytics',
      icon: '💰',
      color: 'yellow'
    },
    { 
      type: 'analytics', 
      label: 'Analytics Report', 
      description: 'Export comprehensive business analytics',
      icon: '📊',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Data Export</h2>
        <p className="text-gray-600 mt-1">Export your business data in various formats</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Export Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => setFilters({...filters, format: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="csv">CSV Format</option>
              <option value="pdf">PDF Format</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportOptions.map(option => (
          <div key={option.type} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(option.color)} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleExport(option.type, 'csv')}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader size="sm" className="mr-2" />
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  CSV
                </button>
                <button
                  onClick={() => handleExport(option.type, 'pdf')}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader size="sm" className="mr-2" />
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  PDF
                </button>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="h-1 bg-gray-100">
              <div className={`h-full bg-gradient-to-r ${getColorClasses(option.color)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Export Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• CSV files are ideal for spreadsheet applications and data analysis</p>
              <p>• PDF files provide formatted reports suitable for sharing and printing</p>
              <p>• Use date filters to export data for specific time periods</p>
              <p>• Large exports may take a few moments to process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;