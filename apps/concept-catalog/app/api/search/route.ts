import { searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const { catalogId, query: searchQuery } = await req.json();
    const response = await searchConceptsForCatalog(catalogId, searchQuery, `${session.accessToken}`);
    if (response.status !== 200) {
      console.error('Failed to search concepts', await response.text());
      return new Response('Failed to search concepts', { status: response.status });
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    console.error('Failed to search concepts', error);
    return new Response('Failed to search concepts', { status: 500 });
  }
}
