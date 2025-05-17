import React, { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Logs = () => {
  const [logs, setLogs] = useState<{ date: string, type: string, query: string, response: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("shopopti_logs");
    if (stored) setLogs(JSON.parse(stored));
  }, []);

  const exportCSV = () => {
    const ws = utils.json_to_sheet(logs);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Logs");
    writeFile(wb, "shopopti_logs.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Historique Shopopti+", 14, 16);
    autoTable(doc, {
      head: [["Date", "Type", "Requête", "Réponse"]],
      body: logs.map(l => [l.date, l.type, l.query, l.response]),
      startY: 22
    });
    doc.save("shopopti_logs.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historique des requêtes IA / API</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">Exporter CSV</button>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Exporter PDF</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Requête</th>
            <th className="p-2 border">Réponse</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td className="p-2 border">{log.date}</td>
              <td className="p-2 border">{log.type}</td>
              <td className="p-2 border">{log.query}</td>
              <td className="p-2 border">{log.response}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
