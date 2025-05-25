
// src/pages/generateInvoice.tsx
import React from 'react';
import jsPDF from 'jspdf';

export default function GenerateInvoice() {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Facture", 20, 20);
    doc.text("Client : Jean Dupont", 20, 30);
    doc.text("Produit : Pack E-commerce IA", 20, 40);
    doc.text("Total : 199€ TTC", 20, 50);
    doc.save("facture-shopopti.pdf");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Générer une facture PDF</h1>
      <button className="bg-primary text-white px-4 py-2 rounded" onClick={generatePDF}>
        Télécharger la facture
      </button>
    </div>
  );
}
