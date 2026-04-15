import type { FallbackProps } from 'react-error-boundary';
import styles from './ErrorFallback.module.scss';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>Что-то пошло не так 😞</h2>
      <pre className={styles.errorMessage}>
        {error instanceof Error ? error.message : 'Неизвестная ошибка'}
      </pre>
      <button onClick={resetErrorBoundary} className={styles.errorButton}>
        Попробовать снова
      </button>
    </div>
  );
}
