import { patchEditableFields } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const slug = params;
  const catalogId = slug.slug;

  if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(await req.json());
      const response = await patchEditableFields(catalogId, `${session?.accessToken}`, diff);

      if (response?.status !== 200) {
        return new Response('Failed to update editable field', { status: response?.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update editable field', { status: 500 });
    }
  } else {
    return new Response('Invalid request', { status: 400 });
  }
}

export { handler as PATCH };
