import { NextRequest, NextResponse } from 'next/server';
import { privateEnv, publicEnv } from '@/lib/env';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const { searchParams } = request.nextUrl;

  const url = new URL(
    `${publicEnv.API_URL}/${path.join('/')}?${searchParams.toString()}`,
  );

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(privateEnv.API_KEY && {
        Authorization: `Bearer ${privateEnv.API_KEY}`,
      }),
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return NextResponse.json(
      { message: error.message ?? 'GitHub API error' },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
