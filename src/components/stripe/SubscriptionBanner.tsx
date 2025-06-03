import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Sparkles, X } from 'lucide-react';

const SubscriptionBanner: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setSubscription(data);
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, []);

  if (loading || dismissed || (subscription && subscription.status === 'active')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <Sparkles className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">
            {subscription ? 'Upgrade your plan to unlock all features!' : 'Get started with a premium plan today!'}
          </span>
        </div>
        <div className="flex items-center">
          <Link 
            to="/pricing" 
            className="text-xs sm:text-sm bg-white text-primary-600 px-3 py-1 rounded-md font-medium hover:bg-opacity-90 transition-colors"
          >
            View Plans
          </Link>
          <button 
            onClick={() => setDismissed(true)}
            className="ml-3 text-white hover:text-white/80"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;