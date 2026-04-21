import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api';
import type {
  GitHubContributor,
  FindReviewerParams,
  FindReviewerResult,
} from '@/types/github';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FindResult {
  totalCandidates: number;
  filtered: {
    total: number;
    excluded: {
      current: number;
      blacklisted: number;
    };
  };
}

interface ReviewerState {
  contributors: GitHubContributor[];
  reviewer: GitHubContributor | null;
  findResult: FindResult | null;
  status: Status;
  error: string | null;
}

const initialState: ReviewerState = {
  contributors: [],
  reviewer: null,
  findResult: null,
  status: 'idle',
  error: null,
};

export const fetchReviewer = createAsyncThunk<
  FindReviewerResult,
  FindReviewerParams,
  { rejectValue: string }
>('reviewer/findReviewer', async (params, { rejectWithValue, signal }) => {
  try {
    return await apiClient.findReviewer(params);
  } catch (error) {
    if (signal.aborted) {
      return rejectWithValue('Запрос отменён');
    }
    return rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка',
    );
  }
});

const reviewerSlice = createSlice({
  name: 'reviewer',
  initialState,
  reducers: {
    clearReviewer(state) {
      state.reviewer = null;
      state.findResult = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearContributors(state) {
      state.contributors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.reviewer = null;
        state.findResult = null;
      })
      .addCase(fetchReviewer.fulfilled, (state, action) => {
        const { reviewer, candidates, ...rest } = action.payload;
        state.status = 'success';
        state.reviewer = reviewer;
        state.contributors = candidates;
        state.findResult = rest;
      })
      .addCase(fetchReviewer.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearReviewer, clearError, clearContributors } =
  reviewerSlice.actions;

export default reviewerSlice.reducer;
