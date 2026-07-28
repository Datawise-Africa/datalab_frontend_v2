import { Provider } from 'react-redux';
import { store } from '~/store';
import { ThemeSynchronizer } from '~/store/theme-sync';
import { useIsClient } from '~/hooks/use-is-client';

/**
 * SSR-safe store provider.
 * Avoids PersistGate which renders null until rehydration, causing hydration mismatch.
 * Children always render; redux-persist rehydrates in the background.
 */
export function StoreProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isClient = useIsClient();

  return (
    <Provider store={store}>
      {isClient && <ThemeSynchronizer />}
      {children}
    </Provider>
  );
}
