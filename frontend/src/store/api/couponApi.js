import { baseApi } from './baseApi';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/coupons/validate',
        method: 'POST',
        body: couponData,
      }),
    }),
    applyCoupon: builder.mutation({
      query: (couponCode) => ({
        url: '/coupons/apply',
        method: 'POST',
        body: { code: couponCode },
      }),
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useApplyCouponMutation,
} = couponApi;