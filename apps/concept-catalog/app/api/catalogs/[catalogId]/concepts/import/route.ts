import { importConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, { params: { catalogId } }) => {
  return await withValidSessionForApi(async (session) => {    
    try {
      const concepts = await req.json();
      const response = await importConcepts(concepts, session?.accessToken);

      if (response.status > 399) {
        const error = await response.json();
        return new Response(error?.message ?? 'Failed to import concept', { status: response.status });
      } else {
        return new Response('', { status: response.status });
      }
    } catch (error) {
      console.error('Failed to import concept', error);
      return new Response('Failed to import concept', { status: 500 });
    }
  });
};
