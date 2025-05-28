import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PricingCard from '../components/stripe/PricingCard';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          setCurrentPlan(data.plan);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);

  const plans = [
    {
      title: "Freemium",
      price: "0€",
      description: "Ideal for getting started with Shopopti+",
      features: [
        "10 products max",
        "Limited AI access",
        "No Shopify import",
        "Basic analytics",
        "Community support"
      ],
      priceId: null
    },
    {
      title: "Pro",
      price: "29€/month",
      description: "Perfect for growing stores",
      features: [
        "1000 products",
        "Full SEO + AI optimization",
        "Shopify import",
        "Advanced analytics",
        "Priority support",
        "Multi-channel publishing"
      ],
      priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
      popular: true
    },
    {
      title: "Agency",
      price: "99€/month",
      description: "For multi-store management",
      features: [
        "Unlimited products",
        "Multi-store management",
        "Advanced AI features",
        "White-label reports",
        "Dedicated support",
        "API access"
      ],
      priceId: import.meta.env.VITE_STRIPE_PRICE_AGENCY
    }
  ];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get the right features for your e-commerce business
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              priceId={currentPlan === plan.title.toLowerCase() ? null : plan.priceId}
              popular={plan.popular}
              buttonText={currentPlan === plan.title.toLowerCase() ? 'Current Plan' : 'Subscribe'}
            />
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-white rounded-lg shadow-md p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900">Need a custom plan?</h2>
          <p className="mt-4 text-gray-600">
            Contact our sales team for a tailored solution that fits your specific business needs.
          </p>
          <a
            href="mailto:sales@shopopti.com"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700"
          >
            Contact Sales
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
              <p className="mt-2 text-gray-600">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900">How does billing work?</h4>
              <p className="mt-2 text-gray-600">You'll be billed monthly or annually depending on your chosen plan.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900">Do you offer refunds?</h4>
              <p className="mt-2 text-gray-600">We offer a 14-day money-back guarantee for all new subscriptions.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;