import { patchEditableFields } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const PATCH = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  validateSession(session);
  const slug = params;
  const catalogId = slug.slug;
  try {
    const { diff } = await req.json();
    const response = await patchEditableFields(catalogId, `${session?.accessToken}`, diff);

    if (response?.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to update editable field', { status: 500 });
  }
};
