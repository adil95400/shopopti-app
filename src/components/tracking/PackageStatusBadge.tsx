import React from 'react';

interface PackageStatusBadgeProps {
  status: {
    code: 'delivered' | 'in_transit' | 'out_for_delivery' | 'pending' | 'exception';
    label: string;
    color: 'success' | 'primary' | 'warning' | 'error';
  };
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status.color === 'success' ? 'bg-green-100 text-green-800' :
      status.color === 'error' ? 'bg-red-100 text-red-800' :
      status.color === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'
    }`}>
      {status.label}
    </span>
  );
};

export default PackageStatusBadge;