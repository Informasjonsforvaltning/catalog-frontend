import { searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  return await withValidSessionForApi(async (session) => {
    try {
      const { catalogId, query: searchQuery } = await req.json();
      const response = await searchConceptsForCatalog(catalogId, searchQuery, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to search concepts', { status: 500 });
    }
  });
};
