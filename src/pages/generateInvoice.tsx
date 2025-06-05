import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Plus, Trash2, FileText, Calendar, DollarSign, User, Building } from 'lucide-react';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function GenerateInvoice() {
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [companyName, setCompanyName] = useState('Votre Entreprise');
  const [companyAddress, setCompanyAddress] = useState('123 Rue du Commerce, 75001 Paris');
  const [companyEmail, setCompanyEmail] = useState('contact@votreentreprise.com');
  const [companyPhone, setCompanyPhone] = useState('+33 1 23 45 67 89');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [notes, setNotes] = useState('Merci pour votre confiance !');
  const [taxRate, setTaxRate] = useState(20);

  const addItem = () => {
    setItems([...items, { 
      id: String(items.length + 1), 
      description: '', 
      quantity: 1, 
      unitPrice: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const generatePDF = () => {
    if (!clientName) {
      alert('Veuillez entrer le nom du client');
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("FACTURE", 105, 20, { align: 'center' });
      
      // Informations de l'entreprise
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(companyName, 20, 40);
      doc.text(companyAddress, 20, 45);
      doc.text(`Email: ${companyEmail}`, 20, 50);
      doc.text(`Tél: ${companyPhone}`, 20, 55);
      
      // Informations du client
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Facturer à:", 140, 40);
      doc.setFontSize(10);
      doc.text(clientName, 140, 45);
      doc.text(clientAddress, 140, 50);
      doc.text(clientEmail, 140, 55);
      
      // Informations de la facture
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 65, 170, 10, 'F');
      doc.setFontSize(10);
      doc.text(`Facture N°: ${invoiceNumber}`, 25, 71);
      doc.text(`Date: ${new Date(date).toLocaleDateString('fr-FR')}`, 80, 71);
      doc.text(`Échéance: ${new Date(dueDate).toLocaleDateString('fr-FR')}`, 140, 71);
      
      // Tableau des articles
      (doc as any).autoTable({
        startY: 80,
        head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
        body: items.map(item => [
          item.description,
          item.quantity,
          formatCurrency(item.unitPrice),
          formatCurrency(item.quantity * item.unitPrice)
        ]),
        foot: [
          ['', '', 'Sous-total', formatCurrency(calculateSubtotal())],
          ['', '', `TVA (${taxRate}%)`, formatCurrency(calculateTax())],
          ['', '', 'Total', formatCurrency(calculateTotal())]
        ],
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
      });
      
      // Notes
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Notes:", 20, finalY);
      doc.text(notes, 20, finalY + 5);
      
      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré par Shopopti+ le ${new Date().toLocaleDateString('fr-FR')}`, 105, 280, { align: 'center' });
      
      doc.save(`facture-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération de la facture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Générateur de factures</h1>
          <Button onClick={generatePDF} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </>
            )}
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Informations de la facture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de facture
              </label>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'émission
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'échéance
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-500" />
                Informations de l'entreprise
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <Input
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <Input
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                Informations du client
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du client *
                  </label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <Input
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Ex: 123 Rue du Client, 75002 Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Ex: client@exemple.com"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-md font-medium mb-3 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
            Articles
          </h3>
          
          <div className="mb-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire (€)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description de l'article"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mb-6">
            <Button variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un article
            </Button>
            
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Sous-total:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">TVA:</span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 text-right"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}