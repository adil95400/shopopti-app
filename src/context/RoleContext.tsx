import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define user roles
export type UserRole = 'user' | 'admin' | 'superadmin';

interface RoleContextType {
  role: UserRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  permissions: string[];
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  user: [
    'products.view',
    'products.create',
    'products.edit.own',
    'orders.view.own',
    'orders.create',
    'suppliers.view',
    'analytics.view.basic'
  ],
  admin: [
    'products.view',
    'products.create',
    'products.edit.any',
    'products.delete.any',
    'orders.view.any',
    'orders.create',
    'orders.update.any',
    'suppliers.view',
    'suppliers.create',
    'suppliers.edit',
    'analytics.view.advanced',
    'users.view',
    'users.edit'
  ],
  superadmin: [
    'products.view',
    'products.create',
    'products.edit.any',
    'products.delete.any',
    'orders.view.any',
    'orders.create',
    'orders.update.any',
    'orders.delete.any',
    'suppliers.view',
    'suppliers.create',
    'suppliers.edit',
    'suppliers.delete',
    'analytics.view.advanced',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'settings.view',
    'settings.edit',
    'billing.view',
    'billing.edit'
  ]
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setRole('user');
          setLoading(false);
          return;
        }
        
        // In a real app, you would fetch the user's role from your database
        // For now, we'll check if the user's email contains 'admin' or 'superadmin'
        const email = session.user.email || '';
        
        if (email.includes('superadmin')) {
          setRole('superadmin');
        } else if (email.includes('admin')) {
          setRole('admin');
        } else {
          setRole('user');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
        setLoading(false);
      }
    };
    
    fetchUserRole();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          
          if (email.includes('superadmin')) {
            setRole('superadmin');
          } else if (email.includes('admin')) {
            setRole('admin');
          } else {
            setRole('user');
          }
        } else {
          setRole('user');
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasPermission = (permission: string): boolean => {
    return rolePermissions[role].includes(permission);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        isAdmin: role === 'admin' || role === 'superadmin',
        isSuperAdmin: role === 'superadmin',
        hasPermission,
        permissions: rolePermissions[role],
        loading
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};