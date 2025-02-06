import { createConcept, importConcepts } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, { params }: { params: { catalogId: string } }) => {
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;
    
    const drafConcept = {
      anbefaltTerm: {
        navn: { nb: '' },
      },
      ansvarligVirksomhet: {
        id: catalogId,
      },
    };

    try {
      const response = await createConcept(drafConcept, session?.accessToken);
      if (response.status !== 201) {
        throw new Error();
      }
      const conceptId = response?.headers?.get('location')?.split('/').pop();
      return new Response(JSON.stringify(conceptId), { status: 200 });
    } catch (err) {
      return new Response('Failed to create concept', { status: 500 });
    }
  });
};
