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
    limit: 10,
    ...filters 
  });
  
  const bookings = data?.data?.bookings || [];
  const pagination = data?.data?.pagination;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) return <Loader className="py-8" />;
  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bookings</h2>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {bookings.length === 0 ? (
        <EmptyState 
          title="No bookings found"
          description="No bookings match your current filters."
        />
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <li key={booking._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {booking.user?.name || 'Unknown User'}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {booking.service?.name} - ${booking.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {booking.slot?.date && new Date(booking.slot.date).toLocaleString()}
                      </p>
                      {booking.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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