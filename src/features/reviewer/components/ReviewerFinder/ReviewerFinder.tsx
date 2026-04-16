'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectLogin, selectRepo } from '@/store/selectors';
import { useReviewer } from '@/features/reviewer/hooks/useReviewer';
import { ReviewerStage } from '@/features/reviewer/components/ReviewerStage';
import { Settings } from '@/features/settings/components/Settings';
import { useIsMounted } from '@/hooks/useIsMounted';
import { Button } from '@/components/ui/Button';
import type { GitHubContributor } from '@/types/github';
import styles from './ReviewerFinder.module.scss';

interface ReviewerFinderProps {
  initialContributors: GitHubContributor[];
  initialReviewer: GitHubContributor | null;
}

export const ReviewerFinder = ({
  initialContributors,
  initialReviewer,
}: ReviewerFinderProps) => {
  const login = useAppSelector(selectLogin);
  const repo = useAppSelector(selectRepo);
  const isMounted = useIsMounted();

  const {
    currentCard,
    currentUser,
    reviewer,
    isAnimating,
    isLoading,
    isIdle,
    isError,
    error,
    handleFind,
    handleClearError,
  } = useReviewer({ initialContributors, initialReviewer });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const isFindDisabled = isMounted
    ? isAnimating || !login.trim() || !repo.trim()
    : false;

  const showHint = isMounted && (!login.trim() || !repo.trim());

  return (
    <div className={styles.finder}>
      <header className={styles.finder__header}>
        <div className={styles.finder__branding}>
          <Image
            src="/favicon.ico"
            alt="Reviewer Finder Logo"
            width={40}
            height={40}
            className={styles.finder__logo}
          />
          <h1 className={styles.finder__title}>
            Reviewer<p>Finder</p>
          </h1>
        </div>

        <Button
          variant="ghost"
          onClick={handleToggleSettings}
          aria-expanded={isSettingsOpen}
          aria-controls="settings-panel"
        >
          {isSettingsOpen ? 'Скрыть' : '⚙️ Настройки'}
        </Button>
      </header>

      {isSettingsOpen && (
        <section id="settings-panel" className={styles.finder__settings}>
          <Settings />
        </section>
      )}

      <p className={styles.finder__description}>
        Найдите лучшего ревьюера для вашего репозитория
      </p>

      <div className={styles.finder__actions}>
        <Button
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isFindDisabled}
          onClick={handleFind}
        >
          Найти ревьюера
        </Button>

        {showHint && (
          <p className={styles.finder__hint}>
            Заполните настройки чтобы начать
          </p>
        )}
      </div>

      {isError && error && (
        <div className={styles.finder__error} role="alert">
          <span>⚠️ {error}</span>
          <button
            className={styles.finder__errorDismiss}
            onClick={handleClearError}
            aria-label="Закрыть ошибку"
          >
            ✕
          </button>
        </div>
      )}

      {(currentCard ?? currentUser) && (
        <ReviewerStage
          currentUser={currentUser}
          animatedCard={currentCard}
          reviewer={isAnimating ? null : reviewer}
          isAnimating={isAnimating}
          isIdle={isIdle}
        />
      )}
    </div>
  );
};
