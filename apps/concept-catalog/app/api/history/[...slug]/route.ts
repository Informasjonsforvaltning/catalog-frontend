import { getHistory } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  if (slug?.length == 2) {
    const [catalogId, resourceId] = slug;

    try {
      const response = await getHistory(catalogId, resourceId, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get history', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
