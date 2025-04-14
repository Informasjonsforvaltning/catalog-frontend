import { createChangeRequest, getChangeRequests, updateChangeRequest } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId] = slug;

    try {
      const response = await getChangeRequests(`${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get change requests', { status: 500 });
    }
  });
};

export const POST = async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId] = slug;
    try {
      const reqBody = await req.json();
      const response = await createChangeRequest(reqBody, `${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 201) {
        const errorMsg = `Error when creating change request. Response status: ${
          response.status
        }, message: ${await response.text()}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      const changeRequestId = response?.headers?.get('location')?.split('/').pop();
      return new Response(JSON.stringify(changeRequestId), { status: response.status });
    } catch (error) {
      console.error(error);
      return new Response('Failed to create change request', { status: 500 });
    }
  });
};

export const PUT = async (req: NextRequest, props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId, changeRequestId] = slug;

    try {
      const reqBody = await req.json();
      const response = await updateChangeRequest(
        reqBody,
        `${catalogId}`,
        `${changeRequestId}`,
        `${session?.accessToken}`,
      );
      if (response.status !== 200) {
        const errorMsg = `Error when updating change request. Response status: ${
          response.status
        }, message: ${await response.text()}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      return new Response('Updated change requests', { status: response.status });
    } catch (error) {
      console.error(error);
      return new Response('Failed to update change request', { status: 500 });
    }
  });
};
