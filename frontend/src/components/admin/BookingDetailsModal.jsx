import { useState } from 'react';
import { useUpdateBookingMutation } from '../../store/api/bookingsApi';
import { useDownloadInvoiceMutation } from '../../store/api/invoiceApi';
import Loader from '../shared/Loader';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();
  const [confirmAction, setConfirmAction] = useState(null);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateBooking({ 
        id: booking._id, 
        status: newStatus 
      }).unwrap();
      setConfirmAction(null);
      onClose();
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  const getActionConfig = (action) => {
    switch (action) {
      case 'confirmed':
        return {
          title: 'Confirm Booking',
          message: 'Are you sure you want to confirm this booking? The customer will be notified.',
          icon: '✓',
          color: 'green'
        };
      case 'completed':
        return {
          title: 'Mark as Complete',
          message: 'Mark this booking as completed? This action cannot be undone.',
          icon: '🎉',
          color: 'blue'
        };
      case 'cancelled':
        return {
          title: 'Cancel Booking',
          message: 'Are you sure you want to cancel this booking? The customer will be notified.',
          icon: '✕',
          color: 'red'
        };
      default:
        return null;
    }
  };
  
  const handleDownloadInvoice = async () => {
    try {
      await downloadInvoice(booking._id).unwrap();
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  if (!isOpen || !booking) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const bookingDate = booking.slot?.date ? new Date(booking.slot.date) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {booking.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Booking Details
                </h3>
                <p className="text-blue-100 text-sm">ID: #{booking._id?.slice(-8)}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              <span className="mr-2 text-lg">{getStatusIcon(booking.status)}</span>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900">Customer Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-900">{booking.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{booking.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900">Service Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Service</p>
                <p className="font-medium text-gray-900">{booking.service?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="font-medium text-gray-900">{booking.service?.durationMinutes || 0} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-2xl font-bold text-blue-600">${booking.amount || 0}</p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900">Appointment Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium text-gray-900">
                  {bookingDate ? bookingDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-medium text-gray-900">
                  {bookingDate ? bookingDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 italic">"{booking.notes}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            {['confirmed', 'completed'].includes(booking.status) && (
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader size="sm" className="mr-2" />
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                Download Invoice
              </button>
            )}
            
            {booking.status === 'pending' && (
              <button
                onClick={() => setConfirmAction('confirmed')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓<span className="ml-2">Confirm Booking</span>
              </button>
            )}
            
            {booking.status === 'confirmed' && (
              <button
                onClick={() => setConfirmAction('completed')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎉<span className="ml-2">Mark Complete</span>
              </button>
            )}
            
            {['pending', 'confirmed'].includes(booking.status) && (
              <button
                onClick={() => setConfirmAction('cancelled')}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕<span className="ml-2">Cancel Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setConfirmAction(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  getActionConfig(confirmAction)?.color === 'green' ? 'bg-green-100' :
                  getActionConfig(confirmAction)?.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {getActionConfig(confirmAction)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getActionConfig(confirmAction)?.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {getActionConfig(confirmAction)?.message}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(confirmAction)}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    getActionConfig(confirmAction)?.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    getActionConfig(confirmAction)?.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader size="sm" className="mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Yes, ${getActionConfig(confirmAction)?.title}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsModal;