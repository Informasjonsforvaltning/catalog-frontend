import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { hasOrganizationReadPermission } from '@catalog-frontend/utils';
import { getOrganization } from '@catalog-frontend/data-access';
import { Design, Organization } from '@catalog-frontend/types';
import { useGetDesign, useGetLogo } from '../../hooks/design';
import styles from './banner.module.css';

interface BannerProps {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string;
}

export const Banner = ({ backgroundColor, fontColor, logo }: BannerProps) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}` || '';
  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo;
  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;
  const pageSubtitle = 'organization';

  return (
    <>
      <div
        className={styles.container}
        style={{ background: backgroundColor }}
      >
        {logo && (
          <img
            alt='preview image'
            src={logo}
            className={styles.logo}
            style={{ color: fontColor }}
          />
        )}
        <div className={styles.heading}>
          <h1
            className={styles.title}
            style={{ color: fontColor }}
          >
            Intern begrepskatalog
          </h1>
          <p
            className={styles.company}
            style={{ color: fontColor }}
          >
            Skatteetaten
          </p>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      notFound: true,
    };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return {
    props: {
      organization,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default Banner;

// OBS! Slett dersom den ikke skal brukes
