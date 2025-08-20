import { baseApi } from './baseApi';

export const slotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/slots?${searchParams.toString()}`;
      },
      providesTags: ['Slot'],
    }),
    getSlot: builder.query({
      query: (id) => `/slots/${id}`,
      providesTags: (result, error, id) => [{ type: 'Slot', id }],
    }),
    getSlotsByService: builder.query({
      query: (serviceId) => `/slots?service=${serviceId}&status=open`,
      providesTags: ['Slot'],
    }),
    createSlot: builder.mutation({
      query: (slotData) => ({
        url: '/slots',
        method: 'POST',
        body: slotData,
      }),
      invalidatesTags: ['Slot'],
    }),
    updateSlot: builder.mutation({
      query: ({ id, ...slotData }) => ({
        url: `/slots/${id}`,
        method: 'PUT',
        body: slotData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Slot', id }, 'Slot'],
    }),
    deleteSlot: builder.mutation({
      query: (id) => ({
        url: `/slots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slot'],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useGetSlotQuery,
  useGetSlotsByServiceQuery,
  useCreateSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
} = slotsApi;