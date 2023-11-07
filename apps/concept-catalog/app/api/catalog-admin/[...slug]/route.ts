import { getDesign, getDesignLogo } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;

  if (req.method == 'GET' && slug?.length === 2 && slug[1] === 'design') {
    try {
      const response = await getDesign(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get design', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get design logo', { status: 500 });
    }
  } else if (req.method == 'GET' && slug?.length === 3 && slug[1] === 'design' && slug[2] === 'logo') {
    try {
      const response = await getDesignLogo(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get design logo', { status: response.status });
      }
      const headers = {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
        'Content-Disposition': response.headers.get('Content-Disposition'),
        'Cache-Control': response.headers.get('Cache-Control'),
      };
      const arrayBufferResponse = await response.arrayBuffer();

      return new Response(arrayBufferResponse, { status: response.status, headers });
    } catch (error) {
      return new Response('Failed to get design logo', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export { handler as GET, handler as POST };
