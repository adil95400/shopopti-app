import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (!sessionId) {
          setLoading(false);
          return;
        }

        // Wait a moment to allow the webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch the user's subscription
        const { data } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();
        
        setSubscription(data);
        
        // Redirect to dashboard after 5 seconds
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 5000);
      } catch (error) {
        console.error('Error verifying session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    verifySession();
  }, [sessionId, navigate]);

  const getPlanName = (priceId: string | null) => {
    if (!priceId) return 'Free Plan';
    
    // This should match your price ID in Stripe
    if (priceId === import.meta.env.VITE_STRIPE_PRICE_PRO) {
      return 'Shopopti+';
    }
    
    return 'Unknown Plan';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Verifying your payment...</h2>
            <p className="mt-2 text-gray-600">Please wait while we confirm your subscription.</p>
          </div>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful</h2>
            
            {subscription ? (
              <>
                <p className="mt-2 text-gray-600">
                  Thank you for subscribing to {getPlanName(subscription.price_id)}!
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Your subscription is now active. You'll be redirected to your dashboard in a few seconds.
                </p>
              </>
            ) : (
              <p className="mt-2 text-gray-600">
                Thank you for your payment! Your subscription will be activated shortly.
              </p>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Success;