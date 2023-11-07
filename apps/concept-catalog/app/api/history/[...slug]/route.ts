import { getHistory } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;

  if (slug?.length == 2) {
    const [catalogId, resourceId] = slug;

    try {
      const response = await getHistory(catalogId, resourceId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get history', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      console.error('Failed to get history', error);
      return new Response('Failed to get history', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
