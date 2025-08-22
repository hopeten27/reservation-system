import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Loader from '../shared/Loader';

const PaymentForm = ({ clientSecret, onSuccess, onError, amount, serviceId, slotId, notes }) => {
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
    console.log('Payment form submitted');

    if (!stripe || !elements) {
      console.error('Stripe not loaded:', { stripe: !!stripe, elements: !!elements });
      onError('Payment system not ready. Please refresh and try again.');
      return;
    }

    console.log('Starting payment confirmation...');
    setIsProcessing(true);

    try {
      console.log('Calling stripe.confirmPayment...');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?service=${serviceId}&slot=${slotId}&notes=${encodeURIComponent(notes || '')}&amount=${amount}`,
        },
        redirect: 'if_required'
      });
      console.log('stripe.confirmPayment completed');

      console.log('Stripe confirmPayment result:', { error, paymentIntent });
      
      if (error) {
        console.error('Stripe payment error:', error);
        if (error.type === 'card_error') {
          onError(`Card error: ${error.message}`);
        } else {
          onError(`Payment error: ${error.message}`);
        }
      } else if (paymentIntent) {
        console.log('Payment intent result:', paymentIntent);
        if (paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded, calling success handler');
          onSuccess(paymentIntent);
        } else if (paymentIntent.status === 'requires_action') {
          console.log('Payment requires additional action');
          onError('Payment requires additional authentication');
        } else {
          console.log('Payment status:', paymentIntent.status);
          onError(`Payment status: ${paymentIntent.status}`);
        }
      } else {
        console.error('No payment intent returned');
        onError('No payment result received');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      onError(`Payment failed: ${err.message}`);
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