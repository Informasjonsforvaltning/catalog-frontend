import { NextRequest } from 'next/server';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { getConceptImportResultById, removeImportResultConcept } from '@catalog-frontend/data-access';

export const DELETE = async (req: NextRequest,
                             props: { params: Promise<{ catalogId: string, resultId: string }> }) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId, resultId } = params;

    try {
      const response = await removeImportResultConcept(catalogId, resultId, session?.accessToken);
      if (response.status !== 200) {
        throw new Error();
      }

      return new Response('Success', { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Failed to fetch concepts' }), { status: 500 });
    }
  });
};

export const GET = async (req: NextRequest,
                             props: { params: Promise<{ catalogId: string, resultId: string }> }) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId, resultId } = params;

    try {
      const response = await getConceptImportResultById(catalogId, resultId, session?.accessToken);
      console.log(response);

      const jsonResponse = await response.json();
      //return new Response(JSON.stringify(importResults), { status: 200 });
      return new Response(JSON.stringify(jsonResponse), { status: 200 });
    } catch (err) {
      console.log(err)
      return new Response(JSON.stringify({ message: 'Failed to fetch concepts' }), { status: 500 });
    }
  });
};