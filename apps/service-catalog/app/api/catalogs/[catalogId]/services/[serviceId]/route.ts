import { deleteService } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

export const DELETE = async (req: NextRequest, props: { params: any }) => {
  const params = await props.params;
  return withValidSessionForApi(async (session) => {
    const { catalogId, serviceId } = params;
    try {
      const response = await deleteService(catalogId, serviceId, session?.accessToken);
      if (response.status !== 204) {
        throw new Error();
      }
      return new Response(response?.text?.toString(), { status: 200 });
    } catch {
      return new Response('Failed to delete service', { status: 500 });
    }
  });
};
