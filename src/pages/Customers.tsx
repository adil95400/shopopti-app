import React from 'react';
import { Users, Search, Filter, SlidersHorizontal, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    orders: 12,
    totalSpent: 1250.99,
    lastOrder: '2024-03-10T14:23:54Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+33 6 98 76 54 32',
    location: 'Lyon, France',
    orders: 8,
    totalSpent: 876.50,
    lastOrder: '2024-03-09T09:12:11Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+33 6 45 67 89 01',
    location: 'Marseille, France',
    orders: 5,
    totalSpent: 432.75,
    lastOrder: '2024-03-08T18:45:30Z',
    status: 'inactive'
  }
];

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Clients</h1>
          <p className="text-accent-200">
            Gérez vos clients et leurs commandes
          </p>
        </div>
        <button className="btn btn-primary">
          <Users className="h-5 w-5 mr-2" />
          Ajouter un client
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-400"
 />
            <input
              type="text"
              placeholder="Rechercher des clients..."
              className="input w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
            <button className="btn btn-outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Trier
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent-200/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Commandes</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Total dépensé</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Dernière commande</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-accent-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-accent-200/10 hover:bg-secondary-400"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-400 bg-opacity-10 flex items-center justify-center">
                        <span className="text-primary-400 font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-sm text-accent-200">{customer.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-accent-200">
                        <Mail className="h-4 w-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-accent-200">
                        <Phone className="h-4 w-4 mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">{customer.orders}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">${customer.totalSpent.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-accent-200">{formatDate(customer.lastOrder)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                      ${customer.status === 'active'
                        ? 'bg-success-400/10 text-success-400'
                        : 'bg-accent-200/10 text-accent-200'
                      }`}
                    >
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-accent-200 hover:text-white">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-white mb-4">Vue d'ensemble</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-accent-200">Total clients</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <div>
              <p className="text-sm text-accent-200">Clients actifs</p>
              <p className="text-2xl font-bold text-success-400">987</p>
            </div>
            <div>
              <p className="text-sm text-accent-200">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-primary-400">45</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-white mb-4">Segments</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-accent-200">VIP</span>
              <span className="text-white">124</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-200">Réguliers</span>
              <span className="text-white">456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-200">Occasionnels</span>
              <span className="text-white">654</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-white mb-4">Localisation</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-accent-200">Paris</span>
              <span className="text-white">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-200">Lyon</span>
              <span className="text-white">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-200">Marseille</span>
              <span className="text-white">15%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Customers;