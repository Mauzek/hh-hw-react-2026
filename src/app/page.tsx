import { use } from 'react';
import styles from './page.module.scss';
import { apiClient } from '@/lib/api';
import Image from 'next/image';

export default function Home() {
  const data = use(apiClient.getContributors('Mauzek/BattleCode', 5));
  const { reviewer } = use(
    apiClient.findReviewer({
      repo: 'Mauzek/BattleCode',
      currentLogin: 'Mauzek',
      blacklist: ['alice'],
    }),
  );
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Добро пожаловать в Reviewer Finder!</h1>
        <p className={styles.description}>
          Найдите лучших рецензентов для вашего проекта. Платформа для поиска и
          взаимодействия с экспертами.
        </p>
        {data.length > 0 ? (
          <div className={styles.contributors}>
            <h2>Топ 5 контрибьюторов React:</h2>
            <ul>
              {data.map((contributor) => (
                <li key={contributor.id} className={styles.contributor}>
                  <Image
                    width={50}
                    height={50}
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className={styles.avatar}
                  />
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.login}
                  >
                    {contributor.login}
                  </a>
                  <span className={styles.contributions}>
                    {contributor.contributions} вкладов
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Нет данных о контрибьюторах.</p>
        )}
        <div className={styles.reviewer}>
          <h2>Рекомендованный рецензент:</h2>
          <div className={styles.contributor}>
            <Image
              width={50}
              height={50}
              src={reviewer.avatar_url}
              alt={reviewer.login}
              className={styles.avatar}
            />
            <a
              href={reviewer.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.login}
            >
              {reviewer.login}
            </a>
            <span className={styles.contributions}>
              {reviewer.contributions} вкладов
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
