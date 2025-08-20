import { baseApi } from './baseApi';

export const recurringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRecurringBooking: builder.mutation({
      query: (recurringData) => ({
        url: '/recurring',
        method: 'POST',
        body: recurringData,
      }),
      invalidatesTags: ['Booking'],
    }),
    getRecurringBookings: builder.query({
      query: () => '/recurring',
      providesTags: ['RecurringBooking'],
    }),
    processRecurringBooking: builder.mutation({
      query: ({ id, paymentIntentId }) => ({
        url: `/recurring/${id}/process`,
        method: 'POST',
        body: { paymentIntentId },
      }),
      invalidatesTags: ['Booking', 'RecurringBooking'],
    }),
  }),
});

export const {
  useCreateRecurringBookingMutation,
  useGetRecurringBookingsQuery,
  useProcessRecurringBookingMutation,
} = recurringApi;