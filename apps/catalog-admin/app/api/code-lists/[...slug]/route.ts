import { createCodeList, deleteCodeList, getAllCodeLists, patchCodeList } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';

interface Props {
  params: {
    slug: string[];
  };
}

export async function GET(req, { params }: Props) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const response = await getAllCodeLists(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      return new Response('Failed to get code lists', { status: response.status });
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to get code lists', { status: 500 });
  }
}

export async function POST(req, { params }: Props) {
  const session = await getServerSession(authOptions);
  await validateSession(session);

  const { slug } = params;
  const [catalogId] = slug;
  try {
    const { codeList } = JSON.parse(req.body);
    const response = await createCodeList(codeList, `${session?.accessToken}`, catalogId);
    if (response.status !== 200) {
      return new Response('Failed to create code list', { status: response.status });
    }

    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to create code list', { status: 500 });
  }
}

export async function PATCH(req, { params }: Props) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, codeListId] = slug;
  try {
    const { diff } = JSON.parse(req.body);
    const response = await patchCodeList(catalogId, codeListId, `${session?.accessToken}`, diff);
    if (response?.status !== 200) {
      return new Response('Failed to update code list', { status: response?.status });
    }

    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to update code list', { status: 500 });
  }
}

export async function DELETE(req, { params }: Props) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, codeListId] = slug;
  try {
    const response = await deleteCodeList(catalogId, codeListId, `${session?.accessToken}`);
    if (response.status !== 200) {
      return new Response('Failed to delete code list', { status: response.status });
    }

    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to delete code list', { status: 500 });
  }
}
