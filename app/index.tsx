import { Redirect } from 'expo-router';
import { routes } from '@/core/constants/routes';
import { useAppStore } from '@/store/app-store';

export default function IndexScreen() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return <Redirect href={isAuthenticated ? routes.trips : routes.welcome} />;
}
