import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSlotQuery } from '../store/api/slotsApi';
import { useCreatePaymentIntentMutation } from '../store/api/paymentApi';
import { useForm } from 'react-hook-form';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';
import StripeProvider from '../components/payment/StripeProvider';
import PaymentForm from '../components/payment/PaymentForm';

const BookingPage = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState('details');
  const [paymentData, setPaymentData] = useState(null);
  
  const { data: slotData, isLoading, error } = useGetSlotQuery(slotId);
  const [createPaymentIntent, { isLoading: isCreating }] = useCreatePaymentIntentMutation();
  
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
  
  const handlePaymentSuccess = () => {
    navigate('/bookings');
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setStep('details');
  };
  
  if (isLoading) return <Loader className="py-12" />;
  if (error) return <ErrorState message="Failed to load slot details" />;
  if (!slot) return <ErrorState message="Slot not found" />;

  if (step === 'payment' && paymentData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Payment</h1>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900">{service?.name}</h3>
            <p className="text-gray-600">
              {new Date(slot.date).toLocaleDateString()} at{' '}
              {new Date(slot.date).toLocaleTimeString()}
            </p>
          </div>
          
          <StripeProvider clientSecret={paymentData.clientSecret}>
            <PaymentForm
              clientSecret={paymentData.clientSecret}
              amount={paymentData.amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </StripeProvider>
          
          <button
            onClick={() => setStep('details')}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            ← Back to details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Complete Your Booking
          </h1>
          
          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Service Details
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">{service?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {service?.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration: {service?.durationMinutes} minutes</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">${service?.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Time Slot
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(slot?.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(slot?.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Available spots: {slot?.capacity - slot?.bookedCount} / {slot?.capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Booking Information
              </h2>
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Booking for:</h3>
                  <p className="text-blue-800 dark:text-blue-200">{user?.name}</p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">{user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    {...register('notes')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${service?.price}</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isCreating || slot?.status !== 'open'}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <>
                        <Loader size="sm" className="inline mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    You can cancel up to 24 hours before the appointment
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;