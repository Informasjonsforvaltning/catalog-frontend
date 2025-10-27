import { searchConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  return await withValidSessionForApi(async () => {
    try {
      const searchOperation = await req.json();
      const response = await searchConcepts(searchOperation);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Failed to search concepts on data.norge' }), { status: 500 });
    }
  });
};
