import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CreditCard, Calendar, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import SubscriptionStatus from '../../components/stripe/SubscriptionStatus';

const Subscription: React.FC = () => {
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
        
        <SubscriptionStatus />
      </div>
    </div>
  );
};

export default Subscription;