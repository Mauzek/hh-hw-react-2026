import type { RootState } from './store';

export const selectSettings = (state: RootState) => state.settings;
export const selectLogin = (state: RootState) => state.settings.login;
export const selectRepo = (state: RootState) => state.settings.repo;
export const selectBlacklist = (state: RootState) => state.settings.blacklist;

export const selectReviewer = (state: RootState) => state.reviewer.reviewer;
export const selectContributors = (state: RootState) =>
  state.reviewer.contributors;
export const selectFindResult = (state: RootState) => state.reviewer.findResult;
export const selectReviewerError = (state: RootState) => state.reviewer.error;
export const selectReviewerStatus = (state: RootState) => state.reviewer.status;

export const selectIsIdle = (state: RootState) =>
  state.reviewer.status === 'idle';
export const selectIsLoading = (state: RootState) =>
  state.reviewer.status === 'loading';
export const selectIsSuccess = (state: RootState) =>
  state.reviewer.status === 'success';
export const selectIsError = (state: RootState) =>
  state.reviewer.status === 'error';
