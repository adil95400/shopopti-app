import React from 'react';
import { Check } from 'lucide-react';
import CheckoutButton from './CheckoutButton';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId: string | null;
  popular?: boolean;
  buttonText?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  priceId,
  popular = false,
  buttonText = 'Subscribe'
}) => {
  return (
    <div className={`rounded-lg border ${popular ? 'border-primary-400 shadow-lg' : 'border-gray-200'} bg-white p-6 shadow-sm transition-all hover:shadow-md`}>
      {popular && (
        <div className="mb-4">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-4 text-3xl font-bold">{price}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        {priceId ? (
          <CheckoutButton 
            priceId={priceId} 
            className={`w-full ${popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
          >
            {buttonText}
          </CheckoutButton>
        ) : (
          <button 
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
            disabled
          >
            Current Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingCard;