import { getHistory } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;

  if (req.method == 'GET' && slug?.length == 2) {
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

export { handler as GET, handler as POST };
