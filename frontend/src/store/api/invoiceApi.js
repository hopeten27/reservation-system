import { baseApi } from './baseApi';

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceData: builder.query({
      query: (bookingId) => `/invoices/${bookingId}/data`,
      providesTags: (result, error, bookingId) => [{ type: 'Invoice', id: bookingId }],
    }),
    downloadInvoice: builder.mutation({
      query: (bookingId) => ({
        url: `/invoices/${bookingId}`,
        method: 'GET',
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error('Failed to download invoice');
          }
          const blob = await response.blob();
          if (blob.size === 0) {
            throw new Error('Empty PDF file');
          }
          const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${bookingId}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
          return { success: true };
        },
      }),
    }),
  }),
});

export const { useGetInvoiceDataQuery, useDownloadInvoiceMutation } = invoiceApi;