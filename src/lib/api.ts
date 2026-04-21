import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import type {
  FindReviewerParams,
  FindReviewerResult,
  GitHubContributor,
} from '@/types/github';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return 'https://api.github.com';
  }
  return '/api/github';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
});

if (typeof window === 'undefined') {
  const { privateEnv } = await import('@/lib/env');
  if (privateEnv.API_KEY) {
    instance.defaults.headers.common['Authorization'] =
      `Bearer ${privateEnv.API_KEY}`;
  }
}

const api = setupCache(instance, {
  ttl: 1000 * 60 * 5,
  methods: ['get'],
});

const HTTP_ERRORS: Record<number, string> = {
  401: 'Неверный или истёкший токен GitHub',
  403: 'Доступ запрещён — возможно, превышен rate limit',
  404: 'Репозиторий не найден',
  422: 'Некорректные данные запроса',
  429: 'Превышен rate limit GitHub API',
};

const request = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> => {
  try {
    const { data } = await api.get<T>(endpoint, { params });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = (error.response?.data as { message?: string })
        ?.message;

      const message =
        (status && HTTP_ERRORS[status]) ??
        serverMessage ??
        'Неизвестная ошибка запроса';

      throw new Error(String(message));
    }

    throw new Error(
      error instanceof Error ? error.message : 'Неизвестная ошибка',
    );
  }
};

const validateRepo = (repo: string): void => {
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) {
    throw new Error('Неверный формат репозитория — ожидается "owner/repo"');
  }
};

const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const apiClient = {
  getContributors: async (
    repo: string,
    perPage = 100,
  ): Promise<GitHubContributor[]> => {
    validateRepo(repo);
    return await request<GitHubContributor[]>(`/repos/${repo}/contributors`, {
      per_page: Math.min(perPage, 100),
    });
  },

  findReviewer: async ({
    repo,
    currentLogin,
    blacklist,
    perPage = 100,
  }: FindReviewerParams): Promise<FindReviewerResult> => {
    if (!currentLogin.trim()) {
      throw new Error('Логин пользователя не может быть пустым');
    }

    const contributors = await apiClient.getContributors(repo, perPage);

    if (contributors.length === 0) {
      throw new Error('В репозитории нет контрибьюторов');
    }

    const currentLower = currentLogin.toLowerCase();
    const blacklistLower = new Set(blacklist.map((l) => l.toLowerCase()));

    const candidates = contributors.filter(({ login }) => {
      const l = login.toLowerCase();
      return l !== currentLower && !blacklistLower.has(l);
    });

    if (candidates.length === 0) {
      throw new Error('Нет подходящих ревьюеров — все исключены');
    }

    const isCurrentPresent = contributors.some(
      (c) => c.login.toLowerCase() === currentLower,
    );

    return {
      reviewer: pickRandom(candidates),
      candidates,
      totalCandidates: contributors.length,
      filtered: {
        total: candidates.length,
        excluded: {
          current: isCurrentPresent ? 1 : 0,
          blacklisted:
            contributors.length -
            candidates.length -
            (isCurrentPresent ? 1 : 0),
        },
      },
    };
  },
};
