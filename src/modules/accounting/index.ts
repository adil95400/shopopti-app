import { supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
}

export interface InvoiceItem {
  id?: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  total: number;
}

export interface TaxReport {
  period: string;
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalTaxCollected: number;
  taxRates: {
    rate: number;
    taxableAmount: number;
    taxCollected: number;
  }[];
  invoices: string[];
}

export const accountingService = {
  async getInvoices(filters?: {
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Invoice[]> {
    try {
      let query = supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .order('issue_date', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }
      
      if (filters?.startDate) {
        query = query.gte('issue_date', filters.startDate.toISOString());
      }
      
      if (filters?.endDate) {
        query = query.lte('issue_date', filters.endDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customerId: invoice.customer_id,
        customerName: invoice.customer_name,
        customerEmail: invoice.customer_email,
        customerAddress: invoice.customer_address,
        items: invoice.invoice_items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          taxRate: item.tax_rate,
          total: item.total
        })),
        subtotal: invoice.subtotal,
        taxRate: invoice.tax_rate,
        taxAmount: invoice.tax_amount,
        total: invoice.total,
        status: invoice.status,
        issueDate: new Date(invoice.issue_date),
        dueDate: new Date(invoice.due_date),
        paidDate: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
        notes: invoice.notes
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  async getInvoice(id: string): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        invoiceNumber: data.invoice_number,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerAddress: data.customer_address,
        items: data.invoice_items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          taxRate: item.tax_rate,
          total: item.total
        })),
        subtotal: data.subtotal,
        taxRate: data.tax_rate,
        taxAmount: data.tax_amount,
        total: data.total,
        status: data.status,
        issueDate: new Date(data.issue_date),
        dueDate: new Date(data.due_date),
        paidDate: data.paid_date ? new Date(data.paid_date) : undefined,
        notes: data.notes
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    try {
      // Insert the invoice
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          invoice_number: invoice.invoiceNumber,
          customer_id: invoice.customerId,
          customer_name: invoice.customerName,
          customer_email: invoice.customerEmail,
          customer_address: invoice.customerAddress,
          subtotal: invoice.subtotal,
          tax_rate: invoice.taxRate,
          tax_amount: invoice.taxAmount,
          total: invoice.total,
          status: invoice.status,
          issue_date: invoice.issueDate.toISOString(),
          due_date: invoice.dueDate.toISOString(),
          paid_date: invoice.paidDate?.toISOString(),
          notes: invoice.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert invoice items
      const invoiceItems = invoice.items.map(item => ({
        invoice_id: data.id,
        product_id: item.productId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax_rate: item.taxRate,
        total: item.total
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
      
      if (itemsError) throw itemsError;
      
      // Get the complete invoice with items
      return this.getInvoice(data.id);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  async updateInvoiceStatus(id: string, status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled', paidDate?: Date): Promise<void> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'paid' && paidDate) {
        updates.paid_date = paidDate.toISOString();
      }
      
      const { error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    try {
      // Delete invoice items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id);
      
      if (itemsError) throw itemsError;
      
      // Then delete the invoice
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  async generateInvoicePDF(invoice: Invoice): Promise<Blob> {
    try {
      const doc = new jsPDF();
      
      // Add company logo and info
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("FACTURE", 105, 20, { align: 'center' });
      
      // Company info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Shopopti+", 20, 40);
      doc.text("123 Rue du Commerce", 20, 45);
      doc.text("75001 Paris, France", 20, 50);
      doc.text("Email: contact@shopopti.com", 20, 55);
      doc.text("Tél: +33 1 23 45 67 89", 20, 60);
      
      // Customer info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Facturer à:", 140, 40);
      doc.setFontSize(10);
      doc.text(invoice.customerName, 140, 45);
      doc.text(invoice.customerAddress.split('\n')[0] || '', 140, 50);
      if (invoice.customerAddress.split('\n')[1]) {
        doc.text(invoice.customerAddress.split('\n')[1], 140, 55);
      }
      doc.text(invoice.customerEmail, 140, 60);
      
      // Invoice details
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 70, 170, 10, 'F');
      doc.setFontSize(10);
      doc.text(`Facture N°: ${invoice.invoiceNumber}`, 25, 76);
      doc.text(`Date: ${invoice.issueDate.toLocaleDateString('fr-FR')}`, 80, 76);
      doc.text(`Échéance: ${invoice.dueDate.toLocaleDateString('fr-FR')}`, 140, 76);
      
      // Invoice items
      autoTable(doc, {
        startY: 85,
        head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
        body: invoice.items.map(item => [
          item.description,
          item.quantity.toString(),
          `${item.unitPrice.toFixed(2)} €`,
          `${item.total.toFixed(2)} €`
        ]),
        foot: [
          ['', '', 'Sous-total', `${invoice.subtotal.toFixed(2)} €`],
          ['', '', `TVA (${invoice.taxRate}%)`, `${invoice.taxAmount.toFixed(2)} €`],
          ['', '', 'Total', `${invoice.total.toFixed(2)} €`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
      });
      
      // Notes
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Notes:", 20, finalY);
      doc.text(invoice.notes || 'Merci pour votre confiance !', 20, finalY + 5);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré par Shopopti+ le ${new Date().toLocaleDateString('fr-FR')}`, 105, 280, { align: 'center' });
      
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  },

  async generateTaxReport(period: string, startDate: Date, endDate: Date): Promise<TaxReport> {
    try {
      // Get all paid invoices in the date range
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('status', 'paid')
        .gte('issue_date', startDate.toISOString())
        .lte('issue_date', endDate.toISOString());
      
      if (error) throw error;
      
      // Calculate totals
      let totalSales = 0;
      let totalTaxCollected = 0;
      const taxRates: Record<number, { taxableAmount: number; taxCollected: number }> = {};
      
      invoices.forEach(invoice => {
        totalSales += invoice.subtotal;
        totalTaxCollected += invoice.tax_amount;
        
        // Group by tax rate
        if (!taxRates[invoice.tax_rate]) {
          taxRates[invoice.tax_rate] = { taxableAmount: 0, taxCollected: 0 };
        }
        
        taxRates[invoice.tax_rate].taxableAmount += invoice.subtotal;
        taxRates[invoice.tax_rate].taxCollected += invoice.tax_amount;
      });
      
      return {
        period,
        startDate,
        endDate,
        totalSales,
        totalTaxCollected,
        taxRates: Object.entries(taxRates).map(([rate, values]) => ({
          rate: parseFloat(rate),
          taxableAmount: values.taxableAmount,
          taxCollected: values.taxCollected
        })),
        invoices: invoices.map(invoice => invoice.invoice_number)
      };
    } catch (error) {
      console.error('Error generating tax report:', error);
      throw error;
    }
  },

  async exportTaxReportPDF(report: TaxReport): Promise<Blob> {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("RAPPORT DE TVA", 105, 20, { align: 'center' });
      
      // Report details
      doc.setFontSize(12);
      doc.text(`Période: ${report.period}`, 20, 40);
      doc.text(`Du: ${report.startDate.toLocaleDateString('fr-FR')}`, 20, 50);
      doc.text(`Au: ${report.endDate.toLocaleDateString('fr-FR')}`, 20, 60);
      
      // Summary
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 70, 170, 30, 'F');
      doc.setFontSize(12);
      doc.text("Résumé", 105, 80, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Total des ventes: ${report.totalSales.toFixed(2)} €`, 30, 90);
      doc.text(`Total TVA collectée: ${report.totalTaxCollected.toFixed(2)} €`, 30, 100);
      
      // Tax rates breakdown
      doc.setFontSize(12);
      doc.text("Détail par taux de TVA", 20, 120);
      
      autoTable(doc, {
        startY: 130,
        head: [['Taux de TVA', 'Montant imposable', 'TVA collectée']],
        body: report.taxRates.map(rate => [
          `${rate.rate}%`,
          `${rate.taxableAmount.toFixed(2)} €`,
          `${rate.taxCollected.toFixed(2)} €`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] }
      });
      
      // Invoices list
      const invoicesY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.text("Factures incluses", 20, invoicesY);
      
      autoTable(doc, {
        startY: invoicesY + 10,
        head: [['N° de facture']],
        body: report.invoices.map(invoice => [invoice]),
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] }
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré par Shopopti+ le ${new Date().toLocaleDateString('fr-FR')}`, 105, 280, { align: 'center' });
      
      return doc.output('blob');
    } catch (error) {
      console.error('Error exporting tax report to PDF:', error);
      throw error;
    }
  },

  async exportTaxReportExcel(report: TaxReport): Promise<Blob> {
    try {
      // Create workbook
      const wb = utils.book_new();
      
      // Create summary worksheet
      const summaryData = [
        ['Rapport de TVA'],
        [''],
        ['Période', report.period],
        ['Date de début', report.startDate.toLocaleDateString('fr-FR')],
        ['Date de fin', report.endDate.toLocaleDateString('fr-FR')],
        [''],
        ['Résumé'],
        ['Total des ventes', `${report.totalSales.toFixed(2)} €`],
        ['Total TVA collectée', `${report.totalTaxCollected.toFixed(2)} €`],
        [''],
        ['Détail par taux de TVA'],
        ['Taux de TVA', 'Montant imposable', 'TVA collectée']
      ];
      
      // Add tax rates
      report.taxRates.forEach(rate => {
        summaryData.push([
          `${rate.rate}%`,
          `${rate.taxableAmount.toFixed(2)} €`,
          `${rate.taxCollected.toFixed(2)} €`
        ]);
      });
      
      // Add invoices list
      summaryData.push([''], ['Factures incluses']);
      report.invoices.forEach(invoice => {
        summaryData.push([invoice]);
      });
      
      const summaryWs = utils.aoa_to_sheet(summaryData);
      utils.book_append_sheet(wb, summaryWs, 'Rapport TVA');
      
      // Generate Excel file
      const excelBuffer = writeFile(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } catch (error) {
      console.error('Error exporting tax report to Excel:', error);
      throw error;
    }
  }
};