import nodemailer from 'nodemailer';
import { Invoice } from '@/types/admin';

// Configure these in your .env file
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@shivkaradigital.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface Lead {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  source: string;
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP credentials not found. Email not sent.');
    console.log('Email details:', { to, subject, html });
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Shivkara Digital" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw, just log so it doesn't break the flow
  }
}

export async function sendLeadNotification(lead: Lead) {
  const subject = `New Lead: ${lead.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Lead Received</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
        <p><strong>Company:</strong> ${lead.company || 'N/A'}</p>
        <p><strong>Budget:</strong> ${lead.budget || 'N/A'}</p>
        <p><strong>Source:</strong> ${lead.source}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${lead.message}</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

export async function sendInvoiceEmail(invoice: Invoice, clientEmail: string) {
  const subject = `Invoice ${invoice.invoiceNumber} from Shivkara Digital`;
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();
  const total = invoice.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1>Shivkara Digital</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Dear ${invoice.clientName},</p>
        <p>Here is the invoice for your recent project/services.</p>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Amount Due:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #15803d;">${total}</span></p>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
        </div>

        <h3>Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f9f9f9; text-align: left;">
            <th style="padding: 10px; border-bottom: 2px solid #eee;">Description</th>
            <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right;">Amount</th>
          </tr>
          ${invoice.items.map((item) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.description}
                <div style="font-size: 0.8em; color: #666;">${item.quantity} x ₹${item.rate}</div>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ₹${(item.quantity * item.rate).toLocaleString()}
              </td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p><strong>Subtotal:</strong> ₹${invoice.subtotal.toLocaleString()}</p>
          <p><strong>Tax (${invoice.taxPercentage}%):</strong> ₹${invoice.tax.toLocaleString()}</p>
          ${invoice.discount ? `<p><strong>Discount:</strong> -₹${invoice.discount.toLocaleString()}</p>` : ''}
          <h3 style="margin-top: 10px;">Total: ${total}</h3>
        </div>

        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
          Please make the payment by the due date. If you have any questions, please reply to this email.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: clientEmail,
    subject,
    html,
  });
}

export async function sendOrderNotification(invoice: any) {
  const subject = `New Order Received: ${invoice.invoiceNumber}`;
  const total = invoice.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Order Received</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <p><strong>Client Name:</strong> ${invoice.clientName}</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Amount:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #15803d;">${total}</span></p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        
        <h3>Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="text-align: left; color: #666; font-size: 0.9em;">
            <th style="padding: 5px 0;">Item</th>
            <th style="padding: 5px 0; text-align: right;">Cost</th>
          </tr>
          ${invoice.items?.map((item: any) => `
            <tr>
              <td style="padding: 5px 0; border-top: 1px solid #eee;">
                ${item.description} <span style="color: #888; font-size: 0.8em;">(x${item.quantity})</span>
              </td>
              <td style="padding: 5px 0; border-top: 1px solid #eee; text-align: right;">
                ₹${(item.quantity * item.rate).toLocaleString()}
              </td>
            </tr>
          `).join('') || ''}
        </table>

        <p style="font-size: 0.9em; color: #666;">A new order has been initiated via Razorpay.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

export async function sendPaymentSuccessEmail(invoice: any, paymentDetails: any) {
  const subject = `Payment Received: ${invoice.invoiceNumber}`;
  const amount = (paymentDetails.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #15803d;">Payment Received Successfully</h2>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0;">
        <p><strong>Client Name:</strong> ${invoice.clientName}</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Amount Paid:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #15803d;">${amount}</span></p>
        <p><strong>Payment ID:</strong> ${paymentDetails.id}</p>
        <p><strong>Method:</strong> ${paymentDetails.method}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <hr style="border: 1px solid #bbf7d0; margin: 20px 0;">
        
        <h3>Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="text-align: left; color: #666; font-size: 0.9em;">
            <th style="padding: 5px 0;">Item</th>
            <th style="padding: 5px 0; text-align: right;">Cost</th>
          </tr>
          ${invoice.items?.map((item: any) => `
            <tr>
              <td style="padding: 5px 0; border-top: 1px solid #bbf7d0;">
                ${item.description} <span style="color: #888; font-size: 0.8em;">(x${item.quantity})</span>
              </td>
              <td style="padding: 5px 0; border-top: 1px solid #bbf7d0; text-align: right;">
                ₹${(item.quantity * item.rate).toLocaleString()}
              </td>
            </tr>
          `).join('') || ''}
        </table>

        <p>The payment has been verified and the invoice is marked as paid.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}
