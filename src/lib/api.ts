import axios, { AxiosError } from 'axios';
import { publicEnv, privateEnv } from './env';
import { setupCache } from 'axios-cache-interceptor';
import {
  FindReviewerParams,
  FindReviewerResult,
  GitHubContributor,
} from '@/types/github';

const instance = axios.create({
  baseURL: publicEnv.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${privateEnv.API_KEY}`,
  },
});

const api = setupCache(instance, {
  ttl: 1000 * 60 * 5,
  methods: ['get'],
});

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

      const errorMessages: Record<number, string> = {
        401: 'Неверный или истёкший токен GitHub',
        403: 'Доступ запрещён (возможно, превышен rate limit)',
        404: 'Репозиторий не найден',
        422: 'Некорректные данные',
        429: 'Превышен rate limit GitHub API',
      };

      const message =
        (status && errorMessages[status]) ||
        (error.response?.data as { message?: string })?.message ||
        'Ошибка запроса';

      throw new AxiosError(message);
    }

    throw new Error(
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
  }
};

/**
 * Валидация формата репозитория
 */
const validateRepoFormat = (repo: string): boolean =>
  /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(repo);

export const apiClient = {
  getContributors: async (
    repo: string,
    perPage = 100,
  ): Promise<GitHubContributor[]> => {
    if (!validateRepoFormat(repo)) {
      throw new Error('Неверный формат репозитория. Ожидается "owner/repo".');
    }
    return await request<GitHubContributor[]>(`/repos/${repo}/contributors`, {
      per_page: Math.min(perPage, 100),
      anon: false,
    });
  },

  findReviewer: async (
    params: FindReviewerParams,
  ): Promise<FindReviewerResult> => {
    const { repo, currentLogin, blacklist, perPage = 100 } = params;

    if (!currentLogin.trim()) {
      throw new Error('Логин пользователя не может быть пустым');
    }

    const contributors = await apiClient.getContributors(repo, perPage);

    if (contributors.length === 0) {
      throw new Error('В репозитории нет контрибьютеров');
    }

    const blacklistLower = blacklist.map((login) => login.toLowerCase());
    const currentLoginLower = currentLogin.toLowerCase();

    const filtered = contributors.filter((contributor) => {
      const isCurrentUser =
        contributor.login.toLowerCase() === currentLoginLower;
      const isBlacklisted = blacklistLower.includes(
        contributor.login.toLowerCase(),
      );
      return !isCurrentUser && !isBlacklisted;
    });

    if (filtered.length === 0) {
      throw new Error(
        'Нет подходящих ревьюеров (все исключены или это единственный контрибьютор)',
      );
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);

    return {
      reviewer: filtered[randomIndex],
      totalCandidates: contributors.length,
      filtered: {
        total: filtered.length,
        excluded: {
          current: contributors.some(
            (c) => c.login.toLowerCase() === currentLoginLower,
          )
            ? 1
            : 0,
          blacklisted: contributors.length - filtered.length - 1,
        },
      },
    };
  },
};
