import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '~/store';
import { ThemeSynchronizer } from '~/store/theme-sync';

const isServer = typeof window === 'undefined';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  if (isServer) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeSynchronizer />
        {children}
      </PersistGate>
    </Provider>
  );
}
