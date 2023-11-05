import { createCodeList, deleteCodeList, getAllCodeLists, patchCodeList } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface Props {
  params: {
    slug: string[];
  };
}

export async function handler(req, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const [catalogId, codeListId] = slug;

  if (req.method == 'GET') {
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
  } else if (req.method == 'POST') {
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
  } else if (req.method == 'PATCH') {
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
  } else if (req.method == 'DELETE') {
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
  } else {
    return new Response('Unauthorized', { status: 400 });
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
