import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Loader from '../shared/Loader';

const PaymentForm = ({ clientSecret, onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (stripe && elements) {
      setIsLoading(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings`,
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
          <p className="text-gray-600">Amount: <span className="font-semibold">${amount}</span></p>
        </div>
        <div className="flex justify-center py-8">
          <Loader />
          <span className="ml-2">Loading payment form...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
        <p className="text-gray-600">Amount: <span className="font-semibold">${amount}</span></p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card']
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;