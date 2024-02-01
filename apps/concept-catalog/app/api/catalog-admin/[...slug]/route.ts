import { getDesign, getDesignLogo } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);

  const { slug } = params;
  if (slug?.length === 2 && slug[1] === 'design') {
    try {
      const response = await getDesign(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get design logo', { status: 500 });
    }
  } else if (slug?.length === 3 && slug[1] === 'design' && slug[2] === 'logo') {
    try {
      const response = await getDesignLogo(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const headers = {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
        ...(response.headers.has('Content-Disposition')
          ? { 'Content-Disposition': response.headers.get('Content-Disposition') ?? '' }
          : {}),
        ...(response.headers.has('Cache-Control')
          ? { 'Cache-Control': response.headers.get('Cache-Control') ?? '' }
          : {}),
      };
      const arrayBufferResponse = await response.arrayBuffer();
      return new Response(arrayBufferResponse, { status: response.status, headers });
    } catch (error) {
      return new Response('Failed to get design logo', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
};
