import { useUpdateBookingMutation } from '../../store/api/bookingsApi';
import { useDownloadInvoiceMutation } from '../../store/api/invoiceApi';
import Loader from '../shared/Loader';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateBooking({ 
        id: booking._id, 
        status: newStatus 
      }).unwrap();
      onClose();
    } catch (error) {
      // Error handled by toast middleware
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" onClick={onClose}></div>
      
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Booking Details
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
              <p><span className="font-medium">Name:</span> {booking.user?.name}</p>
              <p><span className="font-medium">Email:</span> {booking.user?.email}</p>
            </div>

            {/* Service Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
              <p><span className="font-medium">Service:</span> {booking.service?.name}</p>
              <p><span className="font-medium">Duration:</span> {booking.service?.durationMinutes} minutes</p>
              <p><span className="font-medium">Amount:</span> ${booking.amount}</p>
            </div>

            {/* Appointment Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Appointment</h4>
              <p><span className="font-medium">Date:</span> {booking.slot?.date && new Date(booking.slot.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {booking.slot?.date && new Date(booking.slot.date).toLocaleTimeString()}</p>
              {booking.notes && <p><span className="font-medium">Notes:</span> {booking.notes}</p>}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Status: </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              {['confirmed', 'completed'].includes(booking.status) && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {isDownloading ? <Loader size="sm" /> : 'Download Invoice'}
                </button>
              )}
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader size="sm" /> : 'Confirm'}
                </button>
              )}
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader size="sm" /> : 'Mark Complete'}
                </button>
              )}
              
              {['pending', 'confirmed'].includes(booking.status) && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader size="sm" /> : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;