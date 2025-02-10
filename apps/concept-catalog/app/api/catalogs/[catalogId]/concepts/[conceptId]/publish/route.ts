import { publishConcept } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest, { params }: { params: { conceptId: string } }) => {
  return await withValidSessionForApi(async (session) => {
    const { conceptId } = params;
    try {
      const response = await publishConcept(conceptId, session?.accessToken as string);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response?.status });
    } catch (err) {
      return new Response('Failed to publish concept', { status: 500 });
    }
  });
};
