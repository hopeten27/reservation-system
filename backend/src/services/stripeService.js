import Stripe from 'stripe';

let stripe;

const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  return stripe;
};

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const stripeInstance = getStripe();
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true, // Enable all payment methods: card, apple_pay, google_pay, paypal, etc.
      },
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe payment intent creation failed: ${error.message}`);
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const stripeInstance = getStripe();
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe payment confirmation failed: ${error.message}`);
  }
};

export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    const stripeInstance = getStripe();
    const refund = await stripeInstance.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return refund;
  } catch (error) {
    throw new Error(`Stripe refund failed: ${error.message}`);
  }
};

export default getStripe;