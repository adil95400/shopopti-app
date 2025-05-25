import React from 'react';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, BarChart, Wallet, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const mockTransactions = [
  {
    id: '1',
    type: 'payment',
    amount: 129.99,
    currency: 'EUR',
    status: 'completed',
    customer: 'John Doe',
    date: '2024-03-10T14:23:54Z',
    paymentMethod: 'Carte bancaire'
  },
  {
    id: '2',
    type: 'refund',
    amount: 49.99,
    currency: 'EUR',
    status: 'completed',
    customer: 'Jane Smith',
    date: '2024-03-09T09:12:11Z',
    paymentMethod: 'PayPal'
  },
  {
    id: '3',
    type: 'payment',
    amount: 89.99,
    currency: 'EUR',
    status: 'pending',
    customer: 'Mike Johnson',
    date: '2024-03-08T18:45:30Z',
    paymentMethod: 'Apple Pay'
  }
];

const Payments: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Paiements</h1>
          <p className="text-accent-200">
            Gérez vos transactions et paiements
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <RefreshCw className="h-5 w-5 mr-2" />
            Synchroniser
          </button>
          <button className="btn btn-primary">
            <Wallet className="h-5 w-5 mr-2" />
            Retrait
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-accent-200">Solde disponible</h3>
            <DollarSign className="h-5 w-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">2,458.32 €</p>
          <div className="flex items-center mt-2 text-success-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="text-sm">+12.5% ce mois</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-accent-200">Paiements reçus</h3>
            <ArrowUpRight className="h-5 w-5 text-success-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">1,245.89 €</p>
          <p className="text-sm text-accent-200 mt-2">15 transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-accent-200">Remboursements</h3>
            <ArrowDownRight className="h-5 w-5 text-error-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">245.50 €</p>
          <p className="text-sm text-accent-200 mt-2">3 transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-accent-200">Taux de conversion</h3>
            <BarChart className="h-5 w-5 text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">3.2%</p>
          <div className="flex items-center mt-2 text-success-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="text-sm">+0.5% vs hier</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-lg font-medium text-white mb-6">Dernières transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent-200/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Transaction</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Montant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Méthode</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent-200">Statut</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-accent-200/10">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 mr-3
                        ${transaction.type === 'payment'
                          ? 'bg-success-400/10 text-success-400'
                          : 'bg-error-400/10 text-error-400'
                        }`}
                      >
                        {transaction.type === 'payment' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {transaction.type === 'payment' ? 'Paiement' : 'Remboursement'}
                        </div>
                        <div className="text-sm text-accent-200">#{transaction.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">{transaction.customer}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`font-medium
                      ${transaction.type === 'payment' ? 'text-success-400' : 'text-error-400'}`}
                    >
                      {transaction.type === 'refund' ? '- ' : '+ '}
                      {formatAmount(transaction.amount, transaction.currency)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-accent-200" />
                      <span className="text-white">{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-accent-200">{formatDate(transaction.date)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                      ${transaction.status === 'completed'
                        ? 'bg-success-400/10 text-success-400'
                        : 'bg-warning-400/10 text-warning-400'
                      }`}
                    >
                      {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-lg font-medium text-white mb-4">Méthodes de paiement</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-white">Carte bancaire</span>
              </div>
              <span className="text-accent-200">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/paypal.svg" alt="PayPal" className="h-5 w-5 mr-3" />
                <span className="text-white">PayPal</span>
              </div>
              <span className="text-accent-200">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/apple-pay.svg" alt="Apple Pay" className="h-5 w-5 mr-3" />
                <span className="text-white">Apple Pay</span>
              </div>
              <span className="text-accent-200">10%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-lg font-medium text-white mb-4">Prochains retraits</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white">Retrait automatique</p>
                <p className="text-sm text-accent-200">15 mars 2024</p>
              </div>
              <span className="text-white">1,500.00 €</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white">Retrait automatique</p>
                <p className="text-sm text-accent-200">1er avril 2024</p>
              </div>
              <span className="text-white">958.32 €</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payments;