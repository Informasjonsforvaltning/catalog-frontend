//import { deleteLogo, getDesign, getDesignLogo, patchDesign, postDesignLogo } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import httpProxy from 'http-proxy';

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const { catalogId } = req.query;

  new Promise((resolve, reject) => {
    req.url = `${catalogId}/design/logo`;

    const proxy: httpProxy = httpProxy.createProxy();
    proxy.once('error', reject);
    proxy.on('proxyRes', resolve);
    proxy.web(req, res, {
      target: `${process.env.CATALOG_ADMIN_SERVICE_BASE_URI}`,
      changeOrigin: true,
      autoRewrite: true,
      protocolRewrite: 'https',
      headers: {
        cookie: '',
        authorization: `Bearer ${token.access_token}`,
      },
    });
  });
}
