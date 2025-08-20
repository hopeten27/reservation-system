import { useGetInvoiceDataQuery } from '../../store/api/invoiceApi';
import Loader from '../shared/Loader';
import ErrorState from '../shared/ErrorState';

const InvoiceView = ({ bookingId, onClose }) => {
  const { data, isLoading, error } = useGetInvoiceDataQuery(bookingId);
  const invoice = data?.data?.invoice;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loader className="py-8" />;
  if (error) return <ErrorState message="Failed to load invoice" />;
  if (!invoice) return <ErrorState message="Invoice not found" />;

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="print:hidden flex justify-between items-center mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Preview</h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📄 Print/Save PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 border border-gray-300"
          >
            ✕ Close
          </button>
        </div>
      </div>

      <div className="p-8 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-blue-600">
          <div className="text-2xl font-bold text-blue-600">BookingApp</div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">{invoice.invoiceNumber}</div>
            <div>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 ${
              invoice.booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              invoice.booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {invoice.booking.status}
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-blue-600 mb-2">Bill To:</h3>
            <div>{invoice.customer.name}</div>
            <div>{invoice.customer.email}</div>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">Service Details:</h3>
            <div><strong>Date:</strong> {invoice.appointment.formattedDate}</div>
            <div><strong>Time:</strong> {invoice.appointment.formattedTime}</div>
            <div><strong>Duration:</strong> {invoice.service.duration} minutes</div>
          </div>
        </div>

        {/* Service Table */}
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-3 text-left">Service</th>
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3">{invoice.service.name}</td>
              <td className="border border-gray-300 p-3">{invoice.service.description || 'Professional service'}</td>
              <td className="border border-gray-300 p-3 text-center">1</td>
              <td className="border border-gray-300 p-3 text-right">${invoice.booking.amount}</td>
              <td className="border border-gray-300 p-3 text-right">${invoice.booking.amount}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>${invoice.booking.amount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-blue-600 font-bold text-lg text-blue-600">
              <span>Total:</span>
              <span>${invoice.booking.amount}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.booking.notes && (
          <div className="mb-8">
            <h3 className="font-bold text-blue-600 mb-2">Notes:</h3>
            <div>{invoice.booking.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Thank you for your business!</p>
          <p>Payment ID: {invoice.booking.paymentIntentId}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;