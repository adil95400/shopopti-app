import React from 'react';
import { useTranslation } from 'react-i18next';

interface PackageStatusBadgeProps {
  status: {
    code: 'delivered' | 'in_transit' | 'out_for_delivery' | 'pending' | 'exception';
    label: string;
    color: 'success' | 'primary' | 'warning' | 'error';
  };
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation('tracking');
  
  // Map status code to translation key
  const getStatusLabel = (code: string) => {
    switch (code) {
      case 'delivered': return t('status.delivered');
      case 'in_transit': return t('status.inTransit');
      case 'out_for_delivery': return t('status.outForDelivery');
      case 'pending': return t('status.pending');
      case 'exception': return t('status.exception');
      default: return status.label;
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status.color === 'success' ? 'bg-green-100 text-green-800' :
      status.color === 'error' ? 'bg-red-100 text-red-800' :
      status.color === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'
    }`}>
      {getStatusLabel(status.code)}
    </span>
  );
};

export default PackageStatusBadge;