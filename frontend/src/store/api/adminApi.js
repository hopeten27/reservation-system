import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => '/coupons',
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/coupons',
        method: 'POST',
        body: couponData,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
    bulkCreateSlots: builder.mutation({
      query: (slotData) => ({
        url: '/admin/bulk-slots',
        method: 'POST',
        body: slotData,
      }),
      invalidatesTags: ['Slot'],
    }),
    exportData: builder.mutation({
      query: (exportParams) => ({
        url: '/admin/export',
        method: 'POST',
        body: exportParams,
        responseHandler: (response) => response.text(),
      }),
    }),
    getAnalytics: builder.query({
      query: (timeRange) => `/admin/analytics?range=${timeRange}`,
      providesTags: ['Analytics'],
    }),
    getUsers: builder.query({
      query: (filters) => ({
        url: '/admin/users',
        params: filters,
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    banUser: builder.mutation({
      query: ({ id, banned }) => ({
        url: `/admin/users/${id}/ban`,
        method: 'PUT',
        body: { banned },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useBulkCreateSlotsMutation,
  useExportDataMutation,
  useGetAnalyticsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useBanUserMutation,
} = adminApi;