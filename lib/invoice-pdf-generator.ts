import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  clientName: string;
  email: string;
  clientPhone?: string;
  clientAddress?: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdDate: Date;
  description?: string;
  items?: InvoiceItem[];
  taxAmount?: number;
  subtotal?: number;
  notes?: string;
  paymentTerms?: string;
}

export class InvoicePDFGenerator {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF();
  }

  // Company branding colors
  private readonly BRAND_COLORS = {
    primary: [37, 99, 235], // Blue
    secondary: [34, 197, 94], // Green
    accent: [239, 68, 68], // Red
    gray: [75, 85, 99],
    lightGray: [156, 163, 175]
  };

  private addWatermark() {
    // Add subtle watermark
    this.doc.saveGraphicsState();
    this.doc.setGState(this.doc.GState({ opacity: 0.1 }));
    this.doc.setFontSize(60);
    this.doc.setTextColor(this.BRAND_COLORS.primary[0], this.BRAND_COLORS.primary[1], this.BRAND_COLORS.primary[2]);
    
    // Rotate and add watermark text
    this.doc.text('SHIVKARA DIGITAL', 105, 150, {
      angle: 45,
      align: 'center'
    });
    
    this.doc.restoreGraphicsState();
  }

  private addHeader(invoice: InvoiceData) {
    // Company Logo Area (placeholder)
    this.doc.setFillColor(this.BRAND_COLORS.primary[0], this.BRAND_COLORS.primary[1], this.BRAND_COLORS.primary[2]);
    this.doc.roundedRect(15, 15, 60, 20, 3, 3, 'F');
    
    // Company name in logo area
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('SHIVKARA', 18, 26);
    this.doc.text('DIGITAL', 18, 31);

    // Company details
    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", 'normal');
    this.doc.text('Digital Solutions & Software Development', 15, 42);
    this.doc.text('Jodhpur, Rajasthan, India - 342001', 15, 48);
    this.doc.text('GST: 08AAAAA0000A1Z5 | PAN: AAAAA0000A', 15, 54);
    this.doc.text('Email: info@shivkaradigital.com', 15, 60);
    this.doc.text('Phone: +91 95216 99906 | +91 97999 88877', 15, 66);
    this.doc.text('Website: www.shivkaradigital.com', 15, 72);

    // Invoice title and details
    this.doc.setFontSize(32);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('INVOICE', 140, 30);
    
    // Invoice details box
    this.doc.setDrawColor(this.BRAND_COLORS.lightGray[0], this.BRAND_COLORS.lightGray[1], this.BRAND_COLORS.lightGray[2]);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(135, 40, 60, 35, 2, 2);

    this.doc.setFontSize(10);
    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('Invoice Number:', 138, 48);
    this.doc.text('Invoice Date:', 138, 55);
    this.doc.text('Due Date:', 138, 62);
    this.doc.text('Status:', 138, 69);

    this.doc.setFont("helvetica", 'normal');
    this.doc.text(invoice.invoiceNumber, 175, 48);
    this.doc.text(invoice.createdDate.toLocaleDateString(), 175, 55);
    this.doc.text(invoice.dueDate.toLocaleDateString(), 175, 62);
    
    // Status badge
    this.addStatusBadge(invoice.status, 175, 67);
  }

  private addStatusBadge(status: string, x: number, y: number) {
    const statusColors = {
      draft: this.BRAND_COLORS.lightGray,
      sent: this.BRAND_COLORS.primary,
      paid: this.BRAND_COLORS.secondary,
      overdue: this.BRAND_COLORS.accent,
      cancelled: this.BRAND_COLORS.gray
    };

    const color = statusColors[status as keyof typeof statusColors] || statusColors.draft;
    
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(x, y - 4, 18, 6, 1, 1, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text(status.toUpperCase(), x + 1, y);
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  private addClientInfo(invoice: InvoiceData) {
    const startY = 85;
    
    // Bill To section
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(15, startY, 90, 40, 3, 3, 'F');
    
    this.doc.setTextColor(this.BRAND_COLORS.primary[0], this.BRAND_COLORS.primary[1], this.BRAND_COLORS.primary[2]);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('BILL TO:', 20, startY + 8);
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text(invoice.clientName, 20, startY + 16);
    
    this.doc.setFont("helvetica", 'normal');
    this.doc.setFontSize(10);
    if (invoice.email) this.doc.text(`Email: ${invoice.email}`, 20, startY + 23);
    if (invoice.clientPhone) this.doc.text(`Phone: ${invoice.clientPhone}`, 20, startY + 29);
    
    if (invoice.clientAddress) {
      const addressLines = this.doc.splitTextToSize(invoice.clientAddress, 80);
      this.doc.text(addressLines, 20, startY + 35);
    }

    // Payment Terms section
    if (invoice.paymentTerms) {
      this.doc.setFillColor(254, 249, 195);
      this.doc.roundedRect(110, startY, 85, 25, 3, 3, 'F');
      
      this.doc.setTextColor(this.BRAND_COLORS.accent[0], this.BRAND_COLORS.accent[1], this.BRAND_COLORS.accent[2]);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", 'bold');
      this.doc.text('PAYMENT TERMS:', 115, startY + 8);
      
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont("helvetica", 'normal');
      const termsLines = this.doc.splitTextToSize(invoice.paymentTerms, 75);
      this.doc.text(termsLines, 115, startY + 15);
    }
  }

  private addItemsTable(invoice: InvoiceData) {
    const startY = 140;
    
    if (!invoice.items || invoice.items.length === 0) {
      // Simple description if no items
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", 'bold');
      this.doc.text('Service Description:', 15, startY);
      
      this.doc.setFont("helvetica", 'normal');
      this.doc.setFontSize(10);
      const descText = invoice.description || 'Professional services provided';
      const descLines = this.doc.splitTextToSize(descText, 180);
      this.doc.text(descLines, 15, startY + 8);
      
      return startY + 20;
    }

    // Enhanced table with alternating row colors
    (this.doc as any).autoTable({
      startY: startY,
      head: [['#', 'Description', 'Qty', 'Rate (₹)', 'Amount (₹)']],
      body: invoice.items.map((item, index) => [
        (index + 1).toString(),
        item.description,
        item.quantity.toString(),
        `₹${item.rate.toLocaleString('en-IN')}`,
        `₹${item.amount.toLocaleString('en-IN')}`
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: this.BRAND_COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 85 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 15, right: 15 }
    });

    return (this.doc as any).lastAutoTable?.finalY || startY + 60;
  }

  private addTotalsSection(invoice: InvoiceData, startY: number) {
    const totalsX = 120;
    const totalsWidth = 75;
    
    // Totals background
    this.doc.setFillColor(249, 250, 251);
    this.doc.roundedRect(totalsX - 5, startY, totalsWidth, 45, 3, 3, 'F');
    
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(totalsX - 5, startY, totalsWidth, 45, 3, 3);

    let currentY = startY + 10;
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);

    // Subtotal
    const subtotal = invoice.subtotal || invoice.amount;
    this.doc.text('Subtotal:', totalsX, currentY);
    this.doc.text(`₹${subtotal.toLocaleString('en-IN')}`, totalsX + 50, currentY);
    currentY += 8;

    // Tax
    if (invoice.taxAmount && invoice.taxAmount > 0) {
      this.doc.text('Tax/GST:', totalsX, currentY);
      this.doc.text(`₹${invoice.taxAmount.toLocaleString('en-IN')}`, totalsX + 50, currentY);
      currentY += 8;
    }

    // Discount (if any)
    const discount = (subtotal + (invoice.taxAmount || 0)) - invoice.amount;
    if (discount > 0) {
      this.doc.setTextColor(this.BRAND_COLORS.secondary[0], this.BRAND_COLORS.secondary[1], this.BRAND_COLORS.secondary[2]);
      this.doc.text('Discount:', totalsX, currentY);
      this.doc.text(`-₹${discount.toLocaleString('en-IN')}`, totalsX + 50, currentY);
      currentY += 12;
    } else {
      currentY += 4;
    }

    // Total amount with highlighted background
    this.doc.setFillColor(this.BRAND_COLORS.primary[0], this.BRAND_COLORS.primary[1], this.BRAND_COLORS.primary[2]);
    this.doc.roundedRect(totalsX - 2, currentY - 4, totalsWidth - 6, 12, 2, 2, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('TOTAL AMOUNT:', totalsX, currentY + 2);
    this.doc.text(`₹${invoice.amount.toLocaleString('en-IN')}`, totalsX + 50, currentY + 2);

    return currentY + 20;
  }

  private addNotesSection(invoice: InvoiceData, startY: number) {
    if (!invoice.notes) return startY;

    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('Additional Notes:', 15, startY);
    
    this.doc.setFont("helvetica", 'normal');
    this.doc.setFontSize(9);
    const notesLines = this.doc.splitTextToSize(invoice.notes, 180);
    this.doc.text(notesLines, 15, startY + 8);

    return startY + 8 + (notesLines.length * 4) + 10;
  }

  private addFooter(invoice: InvoiceData) {
    const pageHeight = this.doc.internal.pageSize.height;
    const footerY = pageHeight - 50;

    // Footer background
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(0, footerY - 5, 210, 60, 'F');

    // QR Code area (placeholder)
    this.doc.setDrawColor(this.BRAND_COLORS.lightGray[0], this.BRAND_COLORS.lightGray[1], this.BRAND_COLORS.lightGray[2]);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(15, footerY, 30, 30, 3, 3);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);
    this.doc.text('QR CODE', 20, footerY + 12);
    this.doc.text('FOR PAYMENT', 17, footerY + 18);
    this.doc.text('VERIFICATION', 16, footerY + 24);

    // Bank details
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", 'bold');
    this.doc.text('BANK DETAILS:', 55, footerY + 5);
    
    this.doc.setFont("helvetica", 'normal');
    this.doc.setFontSize(8);
    this.doc.text('Bank: State Bank of India', 55, footerY + 12);
    this.doc.text('Account: 12345678901', 55, footerY + 17);
    this.doc.text('IFSC: SBIN0001234', 55, footerY + 22);
    this.doc.text('UPI: payment@shivkara.upi', 55, footerY + 27);

    // Thank you message
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", 'bold');
    this.doc.setTextColor(this.BRAND_COLORS.primary[0], this.BRAND_COLORS.primary[1], this.BRAND_COLORS.primary[2]);
    this.doc.text('Thank you for choosing Shivkara Digital!', 120, footerY + 8);
    
    this.doc.setFont("helvetica", 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(this.BRAND_COLORS.gray[0], this.BRAND_COLORS.gray[1], this.BRAND_COLORS.gray[2]);
    this.doc.text('This is a computer-generated invoice and does not require signature.', 120, footerY + 15);
    this.doc.text('For support, contact us at support@shivkaradigital.com', 120, footerY + 20);
    
    // Page number
    this.doc.setFontSize(7);
    this.doc.text(`Page 1 of 1 | Generated on ${new Date().toLocaleString()}`, 120, footerY + 28);
  }

  generatePDF(invoice: InvoiceData): jsPDF {
    // Reset document
    this.doc = new jsPDF();
    
    // Add watermark
    this.addWatermark();
    
    // Add header with company info
    this.addHeader(invoice);
    
    // Add client information
    this.addClientInfo(invoice);
    
    // Add items table
    const tableEndY = this.addItemsTable(invoice);
    
    // Add totals section
    const totalsEndY = this.addTotalsSection(invoice, tableEndY + 10);
    
    // Add notes section
    const notesEndY = this.addNotesSection(invoice, totalsEndY + 5);
    
    // Add footer
    this.addFooter(invoice);
    
    return this.doc;
  }

  downloadPDF(invoice: InvoiceData, filename?: string): void {
    const pdf = this.generatePDF(invoice);
    const name = filename || `Invoice-${invoice.invoiceNumber}-${invoice.clientName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(name);
  }

  getPDFBlob(invoice: InvoiceData): Blob {
    const pdf = this.generatePDF(invoice);
    return pdf.output('blob');
  }

  getPDFDataURL(invoice: InvoiceData): string {
    const pdf = this.generatePDF(invoice);
    return pdf.output('dataurlstring');
  }
}

// Utility function to create and download PDF
export const generateInvoicePDF = (invoice: InvoiceData, download: boolean = true): jsPDF => {
  const generator = new InvoicePDFGenerator();
  const pdf = generator.generatePDF(invoice);
  
  if (download) {
    generator.downloadPDF(invoice);
  }
  
  return pdf;
};

export default InvoicePDFGenerator;
