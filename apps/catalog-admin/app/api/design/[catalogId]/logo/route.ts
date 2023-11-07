import { getDesignLogo } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export async function handler(req: NextRequest, { params }: { params: { catalogId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { catalogId } = params;

  if (req.method === 'GET') {
    try {
      const response = await getDesignLogo(`${catalogId}`, `${session?.accessToken}`);
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
  }
}

export { handler as GET };
