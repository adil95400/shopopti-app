import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CreditCard, Zap, Calendar, CheckCircle } from 'lucide-react';

const SubscriptionOverview: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }
      
      // Dans une application réelle, récupérez les données depuis Supabase
      // Pour l'instant, nous utilisons des données statiques
      
      // Simuler un délai API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSubscription({
        plan: 'pro',
        status: 'active',
        current_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      'freemium': 'Forfait Gratuit',
      'pro': 'Forfait Pro',
      'agency': 'Forfait Agence'
    };
    
    return planNames[plan] || plan;
  };

  const getPlanFeatures = (plan: string) => {
    const planFeatures: Record<string, string[]> = {
      'freemium': ['10 produits max', 'Accès IA limité', 'Analyses basiques'],
      'pro': ['1000 produits', 'Optimisation IA complète', 'Analyses avancées', 'Support prioritaire'],
      'agency': ['Produits illimités', 'Gestion multi-boutiques', 'Fonctionnalités IA avancées', 'Support dédié']
    };
    
    return planFeatures[plan] || [];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Abonnement</CardTitle>
        {subscription && (
          <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
            {subscription.status === 'active' ? 'Actif' : 'En attente'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <h3 className="font-medium">{getPlanName(subscription.plan)}</h3>
                {subscription.current_period_end && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Renouvellement le {formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {getPlanFeatures(subscription.plan).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="/app/subscription">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gérer l'abonnement
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Vous utilisez actuellement le forfait gratuit avec des fonctionnalités limitées.</p>
            <Button asChild className="w-full">
              <a href="/pricing">Passer à un forfait supérieur</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;