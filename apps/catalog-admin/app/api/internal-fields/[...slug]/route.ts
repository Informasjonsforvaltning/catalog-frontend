import { createInternalField, deleteInternalField, getFields, patchInternalField } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const [catalogId, fieldId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getFields(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get internal fields', { status: response.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get internal fields', { status: 500 });
    }
  } else if (req.method == 'POST') {
    try {
      const { field } = JSON.parse(await req.json());
      const response = await createInternalField(field, `${session?.accessToken}`, catalogId);
      if (response.status !== 200) {
        return new Response('Failed to create internal field', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to create internal field', { status: 500 });
    }
  } else if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(await req.json());
      const response = await patchInternalField(catalogId, fieldId, `${session?.accessToken}`, diff);

      if (response?.status !== 200) {
        return new Response('Failed to update internal field', { status: response?.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update internal field', { status: 500 });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteInternalField(catalogId, fieldId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to delete internal field', { status: response.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to delete internal field', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 400 });
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
