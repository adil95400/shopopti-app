import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getCustomerPortalLink } from '../../lib/stripe';
import { Loader2, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Subscription: React.FC = () => {
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

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'trialing': 'bg-blue-100 text-blue-800',
      'past_due': 'bg-yellow-100 text-yellow-800',
      'canceled': 'bg-red-100 text-red-800',
      'incomplete': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription</h2>
      
      {subscription ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {getPlanName(subscription.plan)}
              </h3>
              <div className="mt-1 flex items-center">
                {getStatusBadge(subscription.status)}
                {subscription.cancel_at_period_end && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Cancels at period end)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleManageSubscription}
              disabled={managingSubscription}
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
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
            </button>
          </div>
          
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
            
            {subscription.status === 'past_due' && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Payment issue</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        We're having trouble processing your payment. Please update your payment method to avoid service interruption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">You don't have an active subscription.</p>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            View Plans
          </a>
        </div>
      )}
    </div>
  );
};

export default Subscription;