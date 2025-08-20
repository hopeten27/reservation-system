import { useState } from 'react';
import { useGetBookingsQuery, useCancelBookingMutation } from '../store/api/bookingsApi';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';
import EmptyState from '../components/shared/EmptyState';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import InvoiceView from '../components/invoice/InvoiceView';

const BookingsPage = () => {
  const [cancelId, setCancelId] = useState(null);
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const { data, isLoading, error } = useGetBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  
  const bookings = data?.data?.bookings || [];

  const handleCancel = async () => {
    try {
      await cancelBooking(cancelId).unwrap();
      setCancelId(null);
    } catch (error) {
      // Error handled by toast middleware
    }
  };
  


  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <Loader className="py-12" />;
  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <EmptyState 
          title="No bookings yet"
          description="You haven't made any bookings. Browse our services to get started!"
          action={
            <a
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Browse Services
            </a>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.service?.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {booking.slot?.date && new Date(booking.slot.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{' '}
                      {booking.slot?.date && new Date(booking.slot.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {booking.service?.durationMinutes} minutes
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ${booking.amount}
                    </p>
                    {booking.notes && (
                      <p>
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {['confirmed', 'completed'].includes(booking.status) && (
                    <button
                      onClick={() => setInvoiceBookingId(booking._id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Invoice
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => setCancelId(booking._id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        type="danger"
      />
      
      {invoiceBookingId && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-5xl w-full max-h-screen overflow-y-auto">
            <InvoiceView 
              bookingId={invoiceBookingId} 
              onClose={() => setInvoiceBookingId(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;