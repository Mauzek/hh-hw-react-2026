import { Suspense } from 'react';
import { apiClient } from '@/lib/api';
import { ReviewerFinder } from '@/features/reviewer';
import type { GitHubContributor } from '@/types/github';
import styles from './page.module.scss';

const DEFAULT_REPO = 'facebook/facebook-ios-sdk';

const getInitialData = async (): Promise<{
  contributors: GitHubContributor[];
  initialReviewer: GitHubContributor | null;
}> => {
  try {
    const contributors = await apiClient.getContributors(DEFAULT_REPO);

    return {
      contributors,
      initialReviewer: null,
    };
  } catch {
    return { contributors: [], initialReviewer: null };
  }
};

export default async function Home() {
  const { contributors, initialReviewer } = await getInitialData();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
          <ReviewerFinder
            initialContributors={contributors}
            initialReviewer={initialReviewer}
          />
        </Suspense>
      </main>
    </div>
  );
}
