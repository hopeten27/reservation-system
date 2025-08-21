import { useState } from 'react';
import { useGetBookingsQuery } from '../../store/api/bookingsApi';
import Loader from '../shared/Loader';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';
import BookingDetailsModal from './BookingDetailsModal';

const BookingsTab = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const { data, isLoading, error } = useGetBookingsQuery({ 
    page, 
    limit: 12,
    ...filters 
  });
  
  const bookings = data?.data?.bookings || [];
  const pagination = data?.data?.pagination;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'cancelled': return '✕';
      case 'completed': return '🎉';
      default: return '❓';
    }
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bookings Management</h2>
          <p className="text-gray-600 mt-1">Track and manage customer bookings</p>
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">No bookings match your current filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const bookingDate = booking.slot?.date ? new Date(booking.slot.date) : null;
              const isToday = bookingDate && new Date().toDateString() === bookingDate.toDateString();
              
              return (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {booking.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {booking.user?.name || 'Unknown User'}
                          </h3>
                        </div>
                        {isToday && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                        <span className="mr-1">{getStatusIcon(booking.status)}</span>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Service</span>
                        <span className="text-lg font-bold text-blue-600">${booking.amount}</span>
                      </div>
                      <p className="text-gray-900 font-medium">{booking.service?.name || 'Unknown Service'}</p>
                    </div>
                    
                    {bookingDate && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                          </svg>
                          <span className="text-sm">
                            {bookingDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {bookingDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {booking.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === pagination.totalPages || (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                    return <span key={pageNum} className="px-2 text-gray-400">…</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      <BookingDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingsTab;