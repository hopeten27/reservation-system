import { createPaymentIntent as createStripePaymentIntent } from '../services/stripeService.js';
import getStripe from '../services/stripeService.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Slot from '../models/Slot.js';

// @desc    Create payment intent
// @route   POST /api/v1/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { serviceId, slotId, notes } = req.body;

    // Get service and slot
    const [service, slot] = await Promise.all([
      Service.findById(serviceId),
      Slot.findById(slotId).populate('service')
    ]);

    if (!service || !slot) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Service or slot not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Check slot availability
    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Slot is fully booked',
          code: 'SLOT_FULL'
        }
      });
    }

    // Create payment intent
    const paymentIntent = await createStripePaymentIntent(
      service.price,
      'usd',
      {
        userId: req.user._id.toString(),
        serviceId: service._id.toString(),
        slotId: slot._id.toString(),
        notes: notes || ''
      }
    );

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: service.price
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/v1/payments/webhook
// @access  Public
export const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.error('Payment failed:', failedPayment.id);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handleSuccessfulPayment = async (paymentIntent) => {
  const { userId, serviceId, slotId, notes } = paymentIntent.metadata;

  try {
    // Create booking
    const booking = await Booking.create({
      user: userId,
      service: serviceId,
      slot: slotId,
      amount: paymentIntent.amount / 100, // Convert from cents
      status: 'confirmed',
      paymentIntentId: paymentIntent.id,
      notes
    });

    // Update slot booked count
    await Slot.findByIdAndUpdate(slotId, {
      $inc: { bookedCount: 1 }
    });

    console.log('Booking created successfully:', booking._id);
  } catch (error) {
    console.error('Error creating booking after payment:', error);
  }
};