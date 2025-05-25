import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const products = [
  { name: "Tapis yoga", score: 92, source: "AliExpress" },
  { name: "Gourde intelligente", score: 87, source: "Amazon" },
  { name: "Lampe LED", score: 75, source: "TikTok" },
  { name: "Support téléphone", score: 88, source: "AliExpress" },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

const sourceCount = products.reduce((acc, p) => {
  acc[p.source] = (acc[p.source] || 0) + 1;
  return acc;
}, {});

const pieData = Object.keys(sourceCount).map((key) => ({
  name: key,
  value: sourceCount[key],
}));

const AIProducts = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produits Gagnants (IA)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <h3 className="font-bold">{p.name}</h3>
            <p>Source : {p.source}</p>
            <p>Score : {p.score}</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Importer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIProducts;
