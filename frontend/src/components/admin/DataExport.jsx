import { useState } from 'react';
import { useExportDataMutation } from '../../store/api/adminApi';

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
    { type: 'bookings', label: 'Bookings', icon: '📅' },
    { type: 'users', label: 'Users', icon: '👥' },
    { type: 'services', label: 'Services', icon: '🎯' },
    { type: 'revenue', label: 'Revenue Report', icon: '💰' },
    { type: 'analytics', label: 'Analytics Report', icon: '📊' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Export Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => setFilters({...filters, format: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map(option => (
          <div key={option.type} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">{option.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-500">Export {option.label.toLowerCase()} data</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport(option.type, 'csv')}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={() => handleExport(option.type, 'pdf')}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? 'Exporting...' : 'PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataExport;