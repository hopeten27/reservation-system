import { baseApi } from './baseApi';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payments/create-payment-intent',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;