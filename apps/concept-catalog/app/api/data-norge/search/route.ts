import { searchConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  return await withValidSessionForApi(async (session) => {
    try {
      const searchOperation = await req.json();
      const response = await searchConcepts(searchOperation);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to search concepts on data.norge', { status: 500 });
    }
  });
};
