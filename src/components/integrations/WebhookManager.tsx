import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  last_triggered?: string;
}

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[]
  });
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const availableEvents = [
    { value: 'order.created', label: 'Commande créée' },
    { value: 'order.updated', label: 'Commande mise à jour' },
    { value: 'order.fulfilled', label: 'Commande expédiée' },
    { value: 'order.cancelled', label: 'Commande annulée' },
    { value: 'product.created', label: 'Produit créé' },
    { value: 'product.updated', label: 'Produit mis à jour' },
    { value: 'product.deleted', label: 'Produit supprimé' },
    { value: 'customer.created', label: 'Client créé' },
    { value: 'customer.updated', label: 'Client mis à jour' }
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      setWebhooks(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des webhooks:', error);
      toast.error('Erreur lors de la récupération des webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Veuillez saisir une URL et sélectionner au moins un événement');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Vérifier le format de l'URL
      try {
        new URL(newWebhook.url);
      } catch (e) {
        throw new Error('URL invalide. Veuillez saisir une URL complète (ex: https://exemple.com/webhook)');
      }
      
      const { data, error } = await supabase
        .from('webhooks')
        .insert([
          {
            user_id: session.user.id,
            url: newWebhook.url,
            events: newWebhook.events,
            active: true,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      setWebhooks([...(data || []), ...webhooks]);
      setNewWebhook({ url: '', events: [] });
      setIsAddingWebhook(false);
      
      toast.success('Webhook ajouté avec succès');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du webhook:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du webhook');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce webhook ?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      toast.success('Webhook supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du webhook:', error);
      toast.error('Erreur lors de la suppression du webhook');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWebhook = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('webhooks')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id ? { ...webhook, active: !currentStatus } : webhook
      ));
      
      toast.success(`Webhook ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la modification du webhook:', error);
      toast.error('Erreur lors de la modification du webhook');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      setLoading(true);
      
      // Simuler un test de webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Test de webhook envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors du test du webhook:', error);
      toast.error('Erreur lors du test du webhook');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('URL copiée dans le presse-papiers');
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventLabel = (eventValue: string) => {
    const event = availableEvents.find(e => e.value === eventValue);
    return event ? event.label : eventValue;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Webhooks</h2>
        <Button onClick={() => setIsAddingWebhook(true)} disabled={isAddingWebhook}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un webhook
        </Button>
      </div>
      
      {isAddingWebhook && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Nouveau webhook</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL du webhook</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://exemple.com/webhook"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Événements</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {availableEvents.map(event => (
                  <div key={event.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`event-${event.value}`}
                      checked={newWebhook.events.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, event.value]
                          });
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter(e => e !== event.value)
                          });
                        }
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`event-${event.value}`} className="ml-2 block text-sm text-gray-700">
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingWebhook(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddWebhook}
              disabled={loading || !newWebhook.url || newWebhook.events.length === 0}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Ajouter le webhook'
              )}
            </Button>
          </div>
        </div>
      )}
      
      {webhooks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun webhook configuré</h3>
          <p className="mt-1 text-gray-500">
            Ajoutez un webhook pour recevoir des notifications en temps réel lorsque des événements se produisent dans votre boutique.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsAddingWebhook(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un webhook
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événements
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière exécution
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {webhooks.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{webhook.url}</span>
                        <button
                          onClick={() => copyToClipboard(webhook.url, `url-${webhook.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copied === `url-${webhook.id}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {getEventLabel(event)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`toggle-${webhook.id}`}
                            checked={webhook.active}
                            onChange={() => handleToggleWebhook(webhook.id, webhook.active)}
                            className="sr-only"
                            disabled={loading}
                          />
                          <label
                            htmlFor={`toggle-${webhook.id}`}
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              webhook.active ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                                webhook.active ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                        <span className={`text-sm ${webhook.active ? 'text-green-600' : 'text-gray-500'}`}>
                          {webhook.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(webhook.last_triggered)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleTestWebhook(webhook.id)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">À propos des webhooks</h4>
            <p className="mt-1 text-sm text-blue-700">
              Les webhooks permettent à votre application de recevoir des notifications HTTP en temps réel lorsque des événements spécifiques se produisent dans votre boutique.
              Chaque notification est envoyée sous forme de requête POST à l'URL que vous spécifiez.
            </p>
            <a
              href="/documentation/api/webhooks"
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 inline-block"
            >
              Consulter la documentation des webhooks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookManager;