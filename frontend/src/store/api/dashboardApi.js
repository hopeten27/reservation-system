import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
      keepUnusedDataFor: 0, // Don't cache
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;