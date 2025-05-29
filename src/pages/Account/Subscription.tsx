import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getCustomerPortalLink } from '../../lib/stripe';
import { Loader2, CreditCard, Calendar, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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

  const getPlanFeatures = (plan: string) => {
    const planFeatures: Record<string, string[]> = {
      'freemium': [
        '10 products max',
        'Limited AI access',
        'Basic analytics',
        'Community support'
      ],
      'pro': [
        '1000 products',
        'Full SEO + AI optimization',
        'Shopify import',
        'Advanced analytics',
        'Priority support',
        'Multi-channel publishing'
      ],
      'agency': [
        'Unlimited products',
        'Multi-store management',
        'Advanced AI features',
        'White-label reports',
        'Dedicated support',
        'API access'
      ]
    };
    
    return planFeatures[plan] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/dashboard" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Management</h2>
        
        {subscription ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getPlanName(subscription.plan)}
                  </h3>
                  <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Badge>
                </div>
                {subscription.cancel_at_period_end && (
                  <p className="mt-1 text-sm text-gray-500">
                    Your subscription will cancel at the end of the current period
                  </p>
                )}
              </div>
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
            </div>
            
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
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Plan Features</h4>
                <div className="space-y-2">
                  {getPlanFeatures(subscription.plan).map((feature, index) => (
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
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Billing History</h4>
              <div className="bg-gray-50 rounded-md p-4 text-center">
                <p className="text-sm text-gray-500">
                  To view your billing history and manage payment methods, click the "Manage Billing" button above.
                </p>
              </div>
            </div>
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
    </div>
  );
};

export default Subscription;