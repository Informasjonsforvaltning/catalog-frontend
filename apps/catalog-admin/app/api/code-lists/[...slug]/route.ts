import { createCodeList, deleteCodeList, getAllCodeLists, patchCodeList } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

interface Props {
  params: {
    slug: string[];
  };
}

export const GET = async (req, { params }: Props) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const response = await getAllCodeLists(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to get code lists', { status: 500 });
  }
};

export const POST = async (req, { params }: Props) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const { codeList } = await req.json();
    const response = await createCodeList(codeList, `${session?.accessToken}`, catalogId);
    if (response.status !== 201) {
      throw new Error();
    }
    return new Response('Created code list', { status: response.status });
  } catch (error) {
    return new Response('Failed to create code list', { status: 500 });
  }
};

export const PATCH = async (req, { params }: Props) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, codeListId] = slug;
  try {
    const { diff } = await req.json();
    const response = await patchCodeList(catalogId, codeListId, `${session?.accessToken}`, diff);
    if (response?.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to update code list', { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: Props) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, codeListId] = slug;
  try {
    const response = await deleteCodeList(catalogId, codeListId, `${session?.accessToken}`);
    if (response.status !== 204) {
      throw new Error();
    }
    return new Response('Code list deleted', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete code list', { status: 500 });
  }
};
