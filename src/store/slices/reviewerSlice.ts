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
>('reviewer/findReviewer', async (params, { rejectWithValue }) => {
  try {
    return await apiClient.findReviewer(params);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка',
    );
  }
});

export const fetchContributors = createAsyncThunk<
  GitHubContributor[],
  { repo: string; perPage?: number },
  { rejectValue: string }
>(
  'reviewer/fetchContributors',
  async ({ repo, perPage }, { rejectWithValue }) => {
    try {
      return await apiClient.getContributors(repo, perPage);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  },
);

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

    builder
      .addCase(fetchContributors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContributors.fulfilled, (state, action) => {
        state.status = 'success';
        state.contributors = action.payload;
      })
      .addCase(fetchContributors.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearReviewer, clearError, clearContributors } =
  reviewerSlice.actions;

export default reviewerSlice.reducer;
