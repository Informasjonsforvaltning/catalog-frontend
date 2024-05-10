import { deleteConcept } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const DELETE = async (req: NextRequest, { params }) => {
  return withValidSessionForApi(async (session) => {
    const { conceptId } = params;
    try {
      const response = await deleteConcept(conceptId, session?.accessToken);
      if (response.status !== 204) {
        throw new Error();
      }
      return new Response(response?.text?.toString(), { status: 200 });
    } catch (err) {
      return new Response('Failed to delete concept', { status: 500 });
    }
  });
};
