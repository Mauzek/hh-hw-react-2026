'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from '@/store/store';
import { hydrateSettings } from '@/store/slices/settingsSlice';
import { ErrorFallback } from './ErrorFallback';

function StoreHydration() {
  useEffect(() => {
    store.dispatch(hydrateSettings());
  }, []);

  return null;
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <StoreHydration />
        {children}
      </Provider>
    </ErrorBoundary>
  );
}
