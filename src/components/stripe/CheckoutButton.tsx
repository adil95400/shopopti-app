import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createCheckoutSession } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ priceId, children, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('You must be logged in to subscribe');
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }
      
      const userId = session.user.id;
      
      // Create checkout session
      const { url } = await createCheckoutSession(priceId, userId);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Error during checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default CheckoutButton;