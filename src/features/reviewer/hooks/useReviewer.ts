'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchReviewer, clearError } from '@/store/slices/reviewerSlice';
import {
  selectLogin,
  selectRepo,
  selectBlacklist,
  selectReviewer,
  selectContributors,
  selectIsLoading,
  selectIsError,
  selectIsIdle,
  selectReviewerError,
} from '@/store/selectors';
import type { GitHubContributor } from '@/types/github';

const ANIMATION_STEPS = 15;
const ANIMATION_INTERVAL_MS = 100;

interface UseReviewerParams {
  initialContributors: GitHubContributor[];
  initialReviewer: GitHubContributor | null;
}

interface UseReviewerReturn {
  currentCard: GitHubContributor | null;
  currentUser: GitHubContributor | null;
  reviewer: GitHubContributor | null;
  isAnimating: boolean;
  isLoading: boolean;
  isIdle: boolean;
  isError: boolean;
  error: string | null;
  handleFind: () => void;
  handleClearError: () => void;
}

export const useReviewer = ({
  initialContributors,
  initialReviewer,
}: UseReviewerParams): UseReviewerReturn => {
  const dispatch = useAppDispatch();

  const login = useAppSelector(selectLogin);
  const repo = useAppSelector(selectRepo);
  const blacklist = useAppSelector(selectBlacklist);
  const reviewer = useAppSelector(selectReviewer);
  const contributors = useAppSelector(selectContributors);
  const isLoading = useAppSelector(selectIsLoading);
  const isIdle = useAppSelector(selectIsIdle);
  const isError = useAppSelector(selectIsError);
  const error = useAppSelector(selectReviewerError);

  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCard, setDisplayCard] = useState<GitHubContributor | null>(
    initialReviewer,
  );

  const prevReviewerRef = useRef<GitHubContributor | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const candidates =
    contributors.length > 0 ? contributors : initialContributors;

  const currentUser = login.trim()
    ? (candidates.find(
        (c) => c.login.toLowerCase() === login.trim().toLowerCase(),
      ) ?? null)
    : null;

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runAnimation = useCallback(
    (finalReviewer: GitHubContributor, pool: GitHubContributor[]) => {
      stopAnimation();

      if (pool.length === 0) {
        setDisplayCard(finalReviewer);
        return;
      }

      setIsAnimating(true);
      setDisplayCard(pool[0]);

      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        const random = pool[Math.floor(Math.random() * pool.length)];
        setDisplayCard(random);

        if (step >= ANIMATION_STEPS) {
          stopAnimation();
          setDisplayCard(finalReviewer);
          setIsAnimating(false);
        }
      }, ANIMATION_INTERVAL_MS);
    },
    [stopAnimation],
  );

  useEffect(() => {
    if (!reviewer) {
      return;
    }

    if (prevReviewerRef.current?.login === reviewer.login) {
      return;
    }

    prevReviewerRef.current = reviewer;

    runAnimation(reviewer, candidates);

    return () => stopAnimation();
  }, [reviewer?.login]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log();
    return () => stopAnimation();
  }, [stopAnimation]);

  const handleFind = useCallback(() => {
    if (!login.trim() || !repo.trim()) {
      return;
    }
    dispatch(clearError());
    dispatch(fetchReviewer({ repo, currentLogin: login, blacklist }));
  }, [dispatch, login, repo, blacklist]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    currentCard: displayCard,
    currentUser,
    reviewer: isAnimating ? null : reviewer,
    isAnimating,
    isLoading,
    isIdle,
    isError,
    error,
    handleFind,
    handleClearError,
  };
};
