import { baseApi } from './baseApi';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/bookings?${searchParams.toString()}`;
      },
      providesTags: ['Booking'],
    }),
    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      // Optimistic update
      async onQueryStarted(bookingData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update slot availability optimistically
          dispatch(
            baseApi.util.updateQueryData('getSlot', bookingData.slot, (draft) => {
              if (draft?.data?.slot) {
                draft.data.slot.bookedCount += 1;
                if (draft.data.slot.bookedCount >= draft.data.slot.capacity) {
                  draft.data.slot.status = 'closed';
                }
              }
            })
          );
          
          // Update slots list
          dispatch(
            baseApi.util.updateQueryData('getSlots', undefined, (draft) => {
              if (draft?.data?.slots) {
                const slot = draft.data.slots.find(s => s._id === bookingData.slot);
                if (slot) {
                  slot.bookedCount += 1;
                  if (slot.bookedCount >= slot.capacity) {
                    slot.status = 'closed';
                  }
                }
              }
            })
          );
        } catch (error) {
          // Revert optimistic update on error
          console.error('Booking creation failed:', error);
        }
      },
      invalidatesTags: ['Booking', 'Slot'],
    }),
    updateBooking: builder.mutation({
      query: ({ id, ...bookingData }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: bookingData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      // Optimistic update for cancellation
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update slot availability optimistically
          if (data?.data?.booking?.slot) {
            const slotId = data.data.booking.slot._id || data.data.booking.slot;
            
            dispatch(
              baseApi.util.updateQueryData('getSlot', slotId, (draft) => {
                if (draft?.data?.slot) {
                  draft.data.slot.bookedCount = Math.max(0, draft.data.slot.bookedCount - 1);
                  if (draft.data.slot.status === 'closed' && draft.data.slot.bookedCount < draft.data.slot.capacity) {
                    draft.data.slot.status = 'open';
                  }
                }
              })
            );
            
            // Update slots list
            dispatch(
              baseApi.util.updateQueryData('getSlots', undefined, (draft) => {
                if (draft?.data?.slots) {
                  const slot = draft.data.slots.find(s => s._id === slotId);
                  if (slot) {
                    slot.bookedCount = Math.max(0, slot.bookedCount - 1);
                    if (slot.status === 'closed' && slot.bookedCount < slot.capacity) {
                      slot.status = 'open';
                    }
                  }
                }
              })
            );
          }
        } catch (error) {
          console.error('Booking cancellation failed:', error);
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Booking', 'Slot'],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
} = bookingsApi;