import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithFormData = async (args, api, extraOptions) => {
  // If body is FormData, don't set Content-Type
  if (args.body instanceof FormData) {
    // Remove Content-Type to let browser set it with boundary
    delete args.headers?.['Content-Type'];
  } else if (typeof args.body === 'object' && args.body !== null) {
    // For regular objects, set JSON content type
    args.headers = {
      ...args.headers,
      'Content-Type': 'application/json',
    };
  }
  
  const result = await customBaseQuery(args, api, extraOptions);
  
  // Handle 401 errors by clearing auth state
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('token');
    api.dispatch({ type: 'auth/clearAuth' });
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithFormData,
  tagTypes: ['User', 'Service', 'Slot', 'Booking'],
  endpoints: () => ({}),
});

export default baseApi;