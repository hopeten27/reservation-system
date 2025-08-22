import { baseApi } from './baseApi';

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceData: builder.query({
      query: (bookingId) => `/invoices/${bookingId}/data`,
      providesTags: (result, error, bookingId) => [{ type: 'Invoice', id: bookingId }],
    }),
    downloadInvoice: builder.mutation({
      queryFn: async (bookingId, { getState }) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices/${bookingId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch invoice');
          }
          
          const data = await response.json();
          const invoice = data.data.invoice;
          
          const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .company { font-size: 24px; font-weight: bold; color: #2563eb; }
    .invoice-number { font-size: 18px; font-weight: bold; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f8f9fa; }
    .total { text-align: right; font-size: 18px; font-weight: bold; color: #2563eb; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">BookingApp</div>
    <div class="invoice-number">${invoice.invoiceNumber}</div>
    <div>Date: ${invoice.invoiceDate}</div>
  </div>
  <div class="section">
    <div class="label">Bill To:</div>
    <div>${invoice.customer.name}</div>
    <div>${invoice.customer.email}</div>
  </div>
  <div class="section">
    <div class="label">Service Details:</div>
    <div>Date: ${invoice.serviceDate}</div>
    <div>Time: ${invoice.serviceTime}</div>
  </div>
  <table>
    <tr><th>Service</th><th>Description</th><th>Amount</th></tr>
    <tr><td>${invoice.service.name}</td><td>${invoice.service.description}</td><td>$${invoice.booking.amount}</td></tr>
  </table>
  <div class="total">Total: $${invoice.booking.amount}</div>
  ${invoice.booking.notes ? `<div class="section"><div class="label">Notes:</div><div>${invoice.booking.notes}</div></div>` : ''}
  <script>window.print();</script>
</body>
</html>`;
          
          const newWindow = window.open('', '_blank');
          newWindow.document.write(html);
          newWindow.document.close();
          
          return { data: { success: true } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
    }),
  }),
});

export const { useGetInvoiceDataQuery, useDownloadInvoiceMutation } = invoiceApi;