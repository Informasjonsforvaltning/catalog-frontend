import { getDesignLogo } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { catalogId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { catalogId } = params;
  try {
    const response = await getDesignLogo(`${catalogId}`, `${session?.accessToken}`);
    if (response.status !== 200) {
      return new Response('Failed to get design logo', { status: response.status });
    }
    const headers = {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      'Content-Disposition': response.headers.get('Content-Disposition'),
      'Cache-Control': response.headers.get('Cache-Control'),
    };
    const arrayBufferResponse = await response.arrayBuffer();
    return new Response(arrayBufferResponse, { status: response.status, headers });
  } catch (error) {
    return new Response('Failed to get design logo', { status: 500 });
  }
}
