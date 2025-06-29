import { importConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, props) => {
  const params = await props.params;

  const { catalogId } = params;

  return await withValidSessionForApi(async (session) => {
    try {
      const concepts = await req.json();
      const response = await importConcepts(concepts, session?.accessToken);

      if (response.status > 399) {
        const error = await response.json();
        return new Response(error?.message ?? 'Failed to import concept', { status: response.status });
      } else {
        return new Response(JSON.stringify({ ok: true }), { status: response.status });
      }
    } catch (error) {
      console.error('Failed to import concept', error);
      return new Response(JSON.stringify({ message: 'Failed to import concept' }), { status: 500 });
    }
  });
};
