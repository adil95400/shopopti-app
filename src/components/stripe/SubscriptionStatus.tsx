import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getCustomerPortalLink } from '../../lib/stripe';
import { Loader2, CreditCard, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }
      
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
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
      
      if (!subscription?.stripe_customer_id) {
        toast.error('No subscription found');
        return;
      }
      
      const portalUrl = await getCustomerPortalLink(subscription.stripe_customer_id);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setManagingSubscription(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      'freemium': 'Free Plan',
      'pro': 'Pro Plan',
      'agency': 'Agency Plan'
    };
    
    return planNames[plan] || plan;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-muted/30">
        <div className="mb-4 p-3 rounded-full bg-muted">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
        <p className="text-muted-foreground mb-4">You're currently on the free plan with limited features.</p>
        <Button asChild>
          <a href="/pricing">View Pricing Plans</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{getPlanName(subscription.plan)}</h3>
            <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
          </div>
          {subscription.cancel_at_period_end && (
            <p className="text-sm text-muted-foreground mt-1">
              Cancels at period end
            </p>
          )}
        </div>
        <Button onClick={handleManageSubscription} disabled={managingSubscription}>
          {managingSubscription ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
          <div>
            <p className="text-sm text-muted-foreground">Current period</p>
            <p className="text-sm font-medium">
              {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
            </p>
          </div>
        </div>
        
        {subscription.status === 'active' && (
          <div className="flex items-start p-4 bg-green-50 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Active Subscription</h4>
              <p className="text-sm text-green-700 mt-1">
                Your subscription is active and you have access to all {subscription.plan} features.
              </p>
            </div>
          </div>
        )}
        
        {subscription.status === 'past_due' && (
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
  );
};

export default SubscriptionStatus;