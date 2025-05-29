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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      'freemium': ['10 products max', 'Limited AI access', 'Basic analytics'],
      'pro': ['1000 products', 'Full AI optimization', 'Advanced analytics', 'Priority support'],
      'agency': ['Unlimited products', 'Multi-store management', 'Advanced AI features', 'Dedicated support']
    };
    
    return planFeatures[plan] || [];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
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
        <CardTitle className="text-lg">Subscription</CardTitle>
        {subscription && (
          <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
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
                    <span>Renews {formatDate(subscription.current_period_end)}</span>
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
                  Manage Subscription
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">You're currently on the free plan with limited features.</p>
            <Button asChild className="w-full">
              <a href="/pricing">Upgrade Now</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;