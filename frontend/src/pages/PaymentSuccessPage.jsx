import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import Loader from '../components/shared/Loader';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const stripe = useStripe();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = searchParams.get('payment_intent_client_secret');
    if (!clientSecret) {
      setError('No payment information found');
      setStatus('error');
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent.status === 'succeeded') {
        // Create booking
        createBooking(paymentIntent);
      } else {
        setError(`Payment ${paymentIntent.status}`);
        setStatus('error');
      }
    });
  }, [stripe, searchParams]);

  const createBooking = async (paymentIntent) => {
    try {
      const serviceId = searchParams.get('service');
      const slotId = searchParams.get('slot');
      const notes = searchParams.get('notes');
      const amount = searchParams.get('amount');

      const result = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          service: serviceId,
          slot: slotId,
          amount: parseFloat(amount),
          paymentIntentId: paymentIntent.id,
          notes: notes || ''
        })
      });

      const data = await result.json();
      
      if (data.success) {
        const booking = data.data?.booking || data.booking;
        setBookingDetails({
          bookingId: booking._id,
          serviceName: booking.service.name,
          date: new Date(booking.slot.date).toLocaleDateString(),
          time: `${new Date(booking.slot.date).toLocaleTimeString()} - ${new Date(booking.slot.end).toLocaleTimeString()}`,
          amount: booking.amount,
          paymentId: paymentIntent.id
        });
        setStatus('success');
      } else {
        setError('Booking creation failed: ' + (data.error?.message || data.message || 'Unknown error'));
        setStatus('error');
      }
    } catch (error) {
      setError('Booking creation failed: ' + error.message);
      setStatus('error');
    }
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Processing your booking...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment and create your booking.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/advanced-services"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
        </div>

        {bookingDetails && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{bookingDetails.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{bookingDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">${bookingDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-xs">{bookingDetails.paymentId}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            to="/bookings"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            View My Bookings
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;