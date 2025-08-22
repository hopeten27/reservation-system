import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSlotQuery } from '../store/api/slotsApi';
import { useCreatePaymentIntentMutation } from '../store/api/paymentApi';
import { useCreateBookingMutation } from '../store/api/bookingsApi';
import { useForm } from 'react-hook-form';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';
import StripeProvider from '../components/payment/StripeProvider';
import PaymentForm from '../components/payment/PaymentForm';

const BookingPage = () => {
  const { slotId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState('details');
  const [paymentData, setPaymentData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const { data: slotData, isLoading, error } = useGetSlotQuery(slotId);
  const [createPaymentIntent, { isLoading: isCreating }] = useCreatePaymentIntentMutation();
  const [createBooking] = useCreateBookingMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const slot = slotData?.data?.slot;
  const service = slot?.service;
  
  const onSubmit = async (data) => {
    try {
      const response = await createPaymentIntent({
        serviceId: service._id,
        slotId,
        notes: data.notes
      }).unwrap();
      
      setPaymentData({
        clientSecret: response.data.clientSecret,
        amount: response.data.amount,
        notes: data.notes
      });
      setStep('payment');
    } catch (error) {
      // Error handled by toast middleware
    }
  };
  
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('Payment success handler called:', paymentIntent);
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          service: service._id,
          slot: slotId,
          amount: paymentData.amount,
          paymentIntentId: paymentIntent.id,
          notes: paymentData.notes || ''
        })
      });
      
      const data = await result.json();
      console.log('Booking created successfully:', data);
      
      if (data.success) {
        setPaymentSuccess(true);
      } else {
        alert('Payment succeeded but booking creation failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Booking creation failed:', error);
      alert('Payment succeeded but booking creation failed. Please contact support.');
    }
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + error);
    setStep('details');
  };
  
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-center animate-pulse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="ml-2 h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="ml-2 h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
          <div className="bg-gray-200 px-8 py-6">
            <div className="h-8 bg-gray-300 rounded mb-2 w-64"></div>
            <div className="h-4 bg-gray-300 rounded w-96"></div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <ErrorState message="Failed to load slot details" />;
  if (!slot) return <ErrorState message="Slot not found" />;

  if (step === 'payment' && paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Payment Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
              <p className="text-blue-100 mt-1">Secure checkout powered by Stripe</p>
            </div>
            
            <div className="p-8">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">{service?.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                  </svg>
                  {new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(slot.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">${paymentData.amount}</span>
                </div>
              </div>
              
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
                  <Link
                    to="/bookings"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View My Bookings
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={async () => {
                      try {
                        const result = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({
                            service: service._id,
                            slot: slotId,
                            amount: paymentData.amount,
                            paymentIntentId: 'pi_test_' + Date.now(),
                            notes: paymentData.notes || 'Test booking'
                          })
                        });
                        const data = await result.json();
                        console.log('Test booking result:', data);
                        if (data.success) {
                          setPaymentSuccess(true);
                        } else {
                          alert('Booking failed: ' + (data.error?.message || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Test booking error:', error);
                        alert('Booking error: ' + error.message);
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Test Create Booking (Skip Payment)
                  </button>
                  
                  <StripeProvider clientSecret={paymentData.clientSecret}>
                    <PaymentForm
                      clientSecret={paymentData.clientSecret}
                      amount={paymentData.amount}
                      serviceId={service._id}
                      slotId={slotId}
                      notes={paymentData.notes}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </StripeProvider>
                </div>
              )}
              
              <button
                onClick={() => setStep('details')}
                className="mt-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to booking details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Booking Details</span>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Complete Your Booking
            </h1>
            <p className="text-blue-100 mt-2">
              Review your selection and provide booking details
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Service & Time Details */}
              <div className="xl:col-span-2 space-y-8">
                {/* Service Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    {service?.image?.url && (
                      <img
                        src={service.image.url}
                        alt={service.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {service?.name}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        {service?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service?.durationMinutes} minutes
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          ${service?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slot Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                    </svg>
                    Selected Time Slot
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(slot?.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(slot?.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">{slot?.capacity - slot?.bookedCount}</span> spots available out of {slot?.capacity}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form & Summary */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      rows={4}
                      {...register('notes')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Any special requirements, preferences, or notes for your appointment..."
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-medium text-gray-900">${service?.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-medium text-gray-900">$0.00</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-blue-600">${service?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreating || slot?.status !== 'open'}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Continue to Payment</span>
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure payment • Cancel up to 24 hours before
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;