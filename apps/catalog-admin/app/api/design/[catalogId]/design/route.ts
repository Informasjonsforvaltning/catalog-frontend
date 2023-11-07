import { getDesign, patchDesign } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest, { params }: { params: { catalogId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { catalogId } = params;

  if (req.method == 'GET') {
    try {
      const response = await getDesign(`${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get design', { status: response.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get design', { status: 500 });
    }
  } else if (req.method == 'PATCH') {
    try {
      const diff = JSON.parse(await req.json());
      const response = await patchDesign(`${catalogId}`, `${session?.accessToken}`, diff);

      if (response?.status !== 200) {
        return new Response('Failed to update design', { status: response?.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update design', { status: 500 });
    }
  } else {
    return new Response('Invalid request', { status: 400 });
  }
}

export { handler as GET, handler as PATCH };
