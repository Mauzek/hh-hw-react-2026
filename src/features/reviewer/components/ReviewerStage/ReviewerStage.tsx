'use client';

import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion';
import Image from 'next/image';
import type { GitHubContributor } from '@/types/github';
import styles from './ReviewerStage.module.scss';

interface ReviewerStageProps {
  currentUser: GitHubContributor | null;
  animatedCard: GitHubContributor | null;
  reviewer: GitHubContributor | null;
  isAnimating: boolean;
  isIdle: boolean;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};

const winnerTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
  delay: 0.1,
};

const badgeTransition: Transition = {
  type: 'spring',
  delay: 0.3,
  stiffness: 300,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const shuffleVariants: Variants = {
  enter: { opacity: 0, y: -12, scale: 0.9 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.08 },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.9,
    transition: { duration: 0.08 },
  },
};

const winnerVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: winnerTransition,
  },
};

const UserAvatar = ({
  contributor,
  label,
  dim = false,
}: {
  contributor: GitHubContributor;
  label: string;
  dim?: boolean;
}) => (
  <motion.div
    className={`${styles.stage__card} ${dim ? styles['stage__card--dim'] : ''}`}
    variants={cardVariants}
  >
    <span className={styles.stage__cardLabel}>{label}</span>
    <div className={styles.stage__avatar}>
      <Image
        src={contributor.avatar_url}
        alt={contributor.login}
        width={64}
        height={64}
        className={styles.stage__avatarImage}
        style={{ width: '100%', height: '100%' }}
        priority
      />
    </div>
    <span className={styles.stage__login}>@{contributor.login}</span>
    <span className={styles.stage__contributions}>
      {contributor.contributions} вкладов
    </span>
  </motion.div>
);

const Arrow = ({ isAnimating }: { isAnimating: boolean }) => (
  <motion.div className={styles.stage__arrow} variants={arrowVariants}>
    <motion.div
      className={styles.stage__arrowLine}
      animate={isAnimating ? { scaleX: [1, 0.8, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.4 }}
    />
    <svg
      className={styles.stage__arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </motion.div>
);

export const ReviewerStage = ({
  currentUser,
  animatedCard,
  reviewer,
  isAnimating,
  isIdle,
}: ReviewerStageProps) => {
  if (!currentUser && !animatedCard) {
    return null;
  }

  return (
    <motion.div
      className={styles.stage}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {currentUser && (
          <UserAvatar contributor={currentUser} label="Вы" dim={isAnimating} />
        )}
      </AnimatePresence>

      {currentUser && animatedCard && <Arrow isAnimating={isAnimating} />}

      <AnimatePresence mode="wait">
        {isAnimating && animatedCard ? (
          <motion.div
            key="shuffling"
            className={styles.stage__shuffleWrapper}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className={styles.stage__cardLabel}>Ищем...</span>

            <div className={styles.stage__shuffleCard}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={animatedCard.login}
                  className={styles.stage__shuffleInner}
                  variants={shuffleVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className={styles.stage__avatar}>
                    <Image
                      src={animatedCard.avatar_url}
                      alt={animatedCard.login}
                      width={64}
                      height={64}
                      className={styles.stage__avatarImage}
                      style={{ width: '100%', height: '100%' }}
                      priority
                    />
                  </div>
                  <span className={styles.stage__login}>
                    @{animatedCard.login}
                  </span>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className={styles.stage__scanLine}
                animate={{ y: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ) : reviewer ? (
          <motion.div
            key="winner"
            className={`${styles.stage__card} ${styles['stage__card--winner']}`}
            variants={winnerVariants}
            initial="hidden"
            animate="visible"
          >
            <span className={styles.stage__cardLabel}>Ревьюер</span>

            <motion.div
              className={styles.stage__badge}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={badgeTransition}
            >
              ✓
            </motion.div>

            <div className={styles.stage__avatar}>
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0px rgba(35,134,54,0.4)',
                    '0 0 0 8px rgba(35,134,54,0)',
                    '0 0 0 0px rgba(35,134,54,0.4)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ borderRadius: '50%' }}
              >
                <Image
                  src={reviewer.avatar_url}
                  alt={reviewer.login}
                  width={64}
                  height={64}
                  className={styles.stage__avatarImage}
                  style={{ width: '100%', height: '100%' }}
                  priority
                />
              </motion.div>
            </div>

            <a
              href={reviewer.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.stage__login} ${styles['stage__login--link']}`}
            >
              @{reviewer.login}
            </a>
            <span className={styles.stage__contributions}>
              {reviewer.contributions} вкладов
            </span>
          </motion.div>
        ) : isIdle && animatedCard ? (
          <motion.div
            key="default"
            className={styles.stage__card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className={styles.stage__cardLabel}>По умолчанию</span>
            <div className={styles.stage__avatar}>
              <Image
                src={animatedCard.avatar_url}
                alt={animatedCard.login}
                width={64}
                height={64}
                className={styles.stage__avatarImage}
                style={{ width: '100%', height: '100%' }}
                priority
              />
            </div>
            <span className={styles.stage__login}>@{animatedCard.login}</span>
            <span className={styles.stage__contributions}>
              {animatedCard.contributions} вкладов
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
