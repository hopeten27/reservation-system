export const generateInvoiceHTML = (booking) => {
  const invoiceNumber = `INV-${booking._id.toString().slice(-8).toUpperCase()}`;
  const invoiceDate = new Date().toLocaleDateString();
  const serviceDate = new Date(booking.slot.date).toLocaleDateString();
  const serviceTime = new Date(booking.slot.date).toLocaleTimeString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        .company {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-number {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
        }
        .billing-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .bill-to, .service-details {
          width: 45%;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        .service-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .service-table th,
        .service-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .service-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .total-label {
          width: 150px;
          text-align: right;
          margin-right: 20px;
        }
        .total-amount {
          width: 100px;
          text-align: right;
          font-weight: bold;
        }
        .grand-total {
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          font-size: 18px;
          color: #2563eb;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status.confirmed {
          background-color: #dcfce7;
          color: #166534;
        }
        .status.completed {
          background-color: #dbeafe;
          color: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company">BookingApp</div>
        <div class="invoice-info">
          <div class="invoice-number">${invoiceNumber}</div>
          <div>Date: ${invoiceDate}</div>
          <div class="status ${booking.status}">${booking.status}</div>
        </div>
      </div>

      <div class="billing-info">
        <div class="bill-to">
          <div class="section-title">Bill To:</div>
          <div>${booking.user.name}</div>
          <div>${booking.user.email}</div>
        </div>
        <div class="service-details">
          <div class="section-title">Service Details:</div>
          <div><strong>Date:</strong> ${serviceDate}</div>
          <div><strong>Time:</strong> ${serviceTime}</div>
          <div><strong>Duration:</strong> ${booking.service.durationMinutes} minutes</div>
        </div>
      </div>

      <table class="service-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${booking.service.name}</td>
            <td>${booking.service.description || 'Professional service'}</td>
            <td>1</td>
            <td>$${booking.amount}</td>
            <td>$${booking.amount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <div class="total-label">Subtotal:</div>
          <div class="total-amount">$${booking.amount}</div>
        </div>
        <div class="total-row">
          <div class="total-label">Tax:</div>
          <div class="total-amount">$0.00</div>
        </div>
        <div class="total-row grand-total">
          <div class="total-label">Total:</div>
          <div class="total-amount">$${booking.amount}</div>
        </div>
      </div>

      ${booking.notes ? `
        <div style="margin-top: 30px;">
          <div class="section-title">Notes:</div>
          <div>${booking.notes}</div>
        </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Payment ID: ${booking.paymentIntentId}</p>
      </div>
    </body>
    </html>
  `;
};