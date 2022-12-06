import { useAuth } from '../contexts/AuthContext';

interface useCanDashboardParams {
  storeId?: number;
}

export function useCanDashboard({ storeId }: useCanDashboardParams): boolean {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return false;

  if (storeId) {
    const hasPermision = user.stores.some((store) => store.id === storeId);

    return hasPermision;
  }

  return true;
}
