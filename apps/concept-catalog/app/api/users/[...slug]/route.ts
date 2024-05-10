import { getUsers } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest, { params }: { params: { slug: string[] } }) => {
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId] = slug;

    try {
      const response = await getUsers(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get user list', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get user list', { status: 500 });
    }
  });
};
