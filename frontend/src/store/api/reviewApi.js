import { baseApi } from './baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceReviews: builder.query({
      query: (serviceId) => `/reviews/service/${serviceId}`,
      providesTags: (result, error, serviceId) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: serviceId }
      ],
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: serviceId }
      ],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { serviceId }) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: serviceId }
      ],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetServiceReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;