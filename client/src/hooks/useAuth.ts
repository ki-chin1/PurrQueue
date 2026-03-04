import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const useHasRole = (role: string) => {
  const { user } = useAuth();
  return user?.role === role;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'ADMIN' || user?.role === 'CATTERY_ADMIN';
};
