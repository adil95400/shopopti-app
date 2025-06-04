import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Zap, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      
      // Get the user's subscription from the view, ordered by subscription period
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }
      
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanName = (priceId: string | null) => {
    if (!priceId) return 'Free Plan';
    
    // This should match your price ID in Stripe
    if (priceId === import.meta.env.VITE_STRIPE_PRICE_PRO) {
      return 'Shopopti+';
    }
    
    return 'Unknown Plan';
  };

  const getPlanFeatures = (priceId: string | null) => {
    if (!priceId) {
      return [
        '10 products max',
        'Limited AI access',
        'Basic analytics',
        'Community support'
      ];
    }
    
    // This should match your price ID in Stripe
    if (priceId === import.meta.env.VITE_STRIPE_PRICE_PRO) {
      return [
        'Unlimited products',
        'Full SEO + AI optimization',
        'Shopify import',
        'Advanced analytics',
        'Priority support',
        'Multi-channel publishing'
      ];
    }
    
    return ['Standard features'];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <Badge variant={subscription.subscription_status === 'active' ? 'success' : 'warning'}>
            {subscription.subscription_status === 'active' ? 'Actif' : 'En attente'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {subscription && subscription.subscription_id ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <h3 className="font-medium">{getPlanName(subscription.price_id)}</h3>
                {subscription.current_period_end && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Renouvellement le {formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {getPlanFeatures(subscription.price_id).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/app/subscription">
                  <span className="mr-2">💳</span>
                  Gérer l'abonnement
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Vous utilisez actuellement le forfait gratuit avec des fonctionnalités limitées.</p>
            <Button asChild className="w-full">
              <Link to="/pricing">Passer à un forfait supérieur</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;