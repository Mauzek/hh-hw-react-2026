export const publicEnv = {
  API_URL: process.env.NEXT_PUBLIC_GITHUB_API_URI,
} as const;

export const privateEnv = {
  API_KEY: process.env.GITHUB_API_KEY,
} as const;
