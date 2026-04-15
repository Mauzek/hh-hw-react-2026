export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  followers?: number;
  following?: number;
}

export interface GitHubContributor extends GitHubUser {
  contributions: number;
}

export interface FindReviewerParams {
  repo: string;
  currentLogin: string;
  blacklist: string[];
  perPage?: number;
}

export interface FindReviewerResult {
  reviewer: GitHubContributor;
  totalCandidates: number;
  filtered: {
    total: number;
    excluded: {
      current: number;
      blacklisted: number;
    };
  };
}
