import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CreditCard, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [managingSubscription, setManagingSubscription] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      
      // Get the user's subscription from the view
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
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

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      
      if (!subscription?.customer_id) {
        toast.error('No subscription found');
        return;
      }
      
      // Redirect to Stripe Customer Portal
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-customer-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          customer_id: subscription.customer_id,
          return_url: `${window.location.origin}/app/subscription`,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setManagingSubscription(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              {subscription && subscription.subscription_id ? getPlanName(subscription.price_id) : 'Free Plan'}
            </h3>
            {subscription && subscription.subscription_id && (
              <Badge variant={subscription.subscription_status === 'active' ? 'success' : 'warning'}>
                {subscription.subscription_status.charAt(0).toUpperCase() + subscription.subscription_status.slice(1)}
              </Badge>
            )}
          </div>
          {subscription && subscription.cancel_at_period_end && (
            <p className="mt-1 text-sm text-gray-500">
              Your subscription will cancel at the end of the current period
            </p>
          )}
        </div>
        {subscription && subscription.subscription_id && (
          <Button
            onClick={handleManageSubscription}
            disabled={managingSubscription}
          >
            {managingSubscription ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </>
            )}
          </Button>
        )}
      </div>
      
      {subscription && subscription.subscription_id ? (
        <div className="mt-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Subscription Details</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Current period</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>
                
                {subscription.subscription_status === 'active' && (
                  <div className="flex items-start p-4 bg-green-50 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Active Subscription</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your subscription is active and you have access to all features.
                      </p>
                    </div>
                  </div>
                )}
                
                {subscription.subscription_status === 'past_due' && (
                  <div className="flex items-start p-4 bg-yellow-50 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Payment Issue</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        We're having trouble processing your payment. Please update your payment method to avoid service interruption.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Plan Features</h4>
              <div className="space-y-2">
                {getPlanFeatures(subscription.price_id).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/pricing">Compare Plans</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {subscription.payment_method_brand && subscription.payment_method_last4 && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h4>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription.payment_method_brand.charAt(0).toUpperCase() + subscription.payment_method_brand.slice(1)} •••• {subscription.payment_method_last4}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Active Subscription</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            You're currently on the free plan with limited features. Upgrade to unlock all the powerful tools Shopopti+ has to offer.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;