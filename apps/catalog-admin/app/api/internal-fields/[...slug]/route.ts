import { createInternalField, deleteInternalField, getFields, patchInternalField } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const response = await getFields(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to get internal fields', { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const { field } = await req.json();
    const response = await createInternalField(field, `${session?.accessToken}`, catalogId);
    if (response.status !== 201) {
      throw new Error();
    }
    return new Response('Created internal field', { status: response.status });
  } catch (error) {
    return new Response('Failed to create internal field', { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, fieldId] = slug;
  try {
    const { diff } = await req.json();
    const response = await patchInternalField(catalogId, fieldId, `${session?.accessToken}`, diff);
    if (response?.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to update internal field', { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, fieldId] = slug;
  try {
    const response = await deleteInternalField(catalogId, fieldId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    return new Response('Internal field deleted', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete internal field', { status: 500 });
  }
};
