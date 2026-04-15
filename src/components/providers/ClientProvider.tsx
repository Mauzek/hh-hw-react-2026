'use client';

import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from '@/store/store';
import { ErrorFallback } from './ErrorFallback';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>{children}</Provider>
    </ErrorBoundary>
  );
}
