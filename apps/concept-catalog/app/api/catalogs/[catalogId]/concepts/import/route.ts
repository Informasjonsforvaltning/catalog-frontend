import { importConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, props) => {
  const params = await props.params;

  const { catalogId } = params;

  return await withValidSessionForApi(async (session) => {
    try {
      const concepts = await req.json();
      const response = await importConcepts(concepts, catalogId, session?.accessToken);
      const location = response?.headers?.get("location")
      const resultId = location?.split('/').pop();

      if (response.status > 399) {
        const error = await response.json();
        return new Response(error?.message ?? 'Failed to import concept', { status: response.status });
      } else if (location && resultId) {
        return new Response('', { status: 302, headers: { Location: `/catalogs/${catalogId}/concepts/import-results/${resultId}` } });
      } else {
        return new Response('', { status: response.status });
      }
    } catch (error) {
      console.error('Failed to import concept', error);
      return new Response('Failed to import concept', { status: 500 });
    }
  });
};
