import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { saveAs } from 'file-saver';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminSubscriptions = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, users: user_id (email, name)')
      .order('created_at', { ascending: false });
    setSubs(data || []);
    setFiltered(data || []);
  };

  const applyFilters = () => {
    const f = subs.filter(s =>
      (!plan || s.plan === plan) &&
      (!status || s.status === status)
    );
    setFiltered(f);
  };

  const exportCSV = () => {
    const rows = filtered.map(s => ({
      user: s.users?.email,
      plan: s.plan,
      status: s.status,
      date: new Date(s.created_at).toLocaleDateString()
    }));
    const header = "Utilisateur,Plan,Statut,Date\n";
    const body = rows.map(r => `${r.user},${r.plan},${r.status},${r.date}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "abonnements_shopopti.csv");
  };

  const planCount: any = {};
  filtered.forEach(s => {
    planCount[s.plan] = (planCount[s.plan] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(planCount),
    datasets: [{
      label: "Répartition des plans",
      data: Object.values(planCount),
      backgroundColor: ["#60a5fa", "#10b981", "#f59e0b"]
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Abonnements utilisateurs</h1>

      <div className="flex gap-4 mb-4">
        <select value={plan} onChange={e => setPlan(e.target.value)} className="border p-2 rounded">
          <option value="">Tous les plans</option>
          <option value="freemium">Freemium</option>
          <option value="pro">Pro</option>
          <option value="agency">Agence</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="canceled">Annulé</option>
        </select>
        <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded">Filtrer</button>
        <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">Exporter CSV</button>
      </div>

      <div className="max-w-md mb-6">
        <Pie data={chartData} />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Utilisateur</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Stripe ID</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => (
            <tr key={i}>
              <td className="p-2 border">{s.users?.name || "—"}</td>
              <td className="p-2 border">{s.users?.email || "—"}</td>
              <td className="p-2 border">{s.plan}</td>
              <td className="p-2 border">{s.status}</td>
              <td className="p-2 border text-xs">{s.stripe_customer_id}</td>
              <td className="p-2 border">{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubscriptions;
