import React, { ReactNode } from 'react';
import { useRole } from '../../context/RoleContext';
import { Navigate } from 'react-router-dom';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Component to guard content based on user permissions
 * 
 * @example
 * <PermissionGuard permission="products.edit.any" redirectTo="/dashboard">
 *   <AdminProductEditor />
 * </PermissionGuard>
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  redirectTo
}) => {
  const { hasPermission, loading } = useRole();

  if (loading) {
    return <div className="flex justify-center p-4">Chargement des permissions...</div>;
  }

  if (!hasPermission(permission)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Accès refusé</h2>
        <p className="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;