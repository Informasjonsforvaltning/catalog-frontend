import { getDesign, patchDesign } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { catalogId: string } }) => {
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;
    try {
      const response = await getDesign(`${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get design', { status: 500 });
    }
  });
};

export const PATCH = async (req: NextRequest, { params }: { params: { catalogId: string } }) => {
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;
    try {
      const diff = await req.json();
      const response = await patchDesign(`${catalogId}`, `${session?.accessToken}`, diff);

      if (response?.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update design', { status: 500 });
    }
  });
};
