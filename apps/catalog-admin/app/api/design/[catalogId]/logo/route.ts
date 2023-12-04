import { getDesignLogo } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { catalogId: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { catalogId } = params;
  try {
    const response = await getDesignLogo(`${catalogId}`, `${session?.accessToken}`);
    if (response.status === 404) {
      return new Response('Design logo not found', { status: 404 });
    }

    if (response.status !== 200) {
      throw new Error('Unable to fetch design logo. Reponse status: ' + response.status);
    }

    const headers = {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      'Content-Disposition': response.headers.get('Content-Disposition') ?? '',
      'Cache-Control': response.headers.get('Cache-Control') ?? 'no-cache',
    };
    const arrayBufferResponse = await response.arrayBuffer();
    return new Response(arrayBufferResponse, { status: response.status, headers });
  } catch (error) {
    console.error('Failed to get design logo', error);
    return new Response('Failed to get design logo', { status: 500 });
  }
};
