import { baseApi } from './baseApi';

export const waitlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    joinWaitlist: builder.mutation({
      query: (waitlistData) => ({
        url: '/waitlist',
        method: 'POST',
        body: waitlistData,
      }),
      invalidatesTags: ['Waitlist'],
    }),
    getUserWaitlist: builder.query({
      query: () => '/waitlist',
      providesTags: ['Waitlist'],
    }),
    getWaitlistStatus: builder.query({
      query: (serviceId) => `/waitlist/service/${serviceId}`,
      providesTags: (result, error, serviceId) => [
        { type: 'Waitlist', id: serviceId }
      ],
    }),
    removeFromWaitlist: builder.mutation({
      query: (id) => ({
        url: `/waitlist/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Waitlist'],
    }),
  }),
});

export const {
  useJoinWaitlistMutation,
  useGetUserWaitlistQuery,
  useGetWaitlistStatusQuery,
  useRemoveFromWaitlistMutation,
} = waitlistApi;