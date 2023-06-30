import { getOrganization } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { Button, List, ListItem, PageBanner } from '@catalog-frontend/ui';
import {
  hasOrganizationReadPermission,
  validChangeRequestId,
  localization as loc,
  validOrganizationNumber,
} from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/router';

export const ChangeRequestsPage = ({ organization }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();
  const changeRequests = [
    { id: '1', catalogId: '11' },
    { id: '2', catalogId: '22' },
    { id: '3', catalogId: '33' },
    { id: '4', catalogId: '44' },
    { id: '5', catalogId: '55' },
    { id: '6', catalogId: '66' },
  ];

  const handleListItemClick = (e) => {
    if (
      validOrganizationNumber(router.query.catalogId.toString()) &&
      validChangeRequestId(changeRequests, e.target.attributes.itemID.value)
    ) {
      router.push(`/catalog/${router.query.catalogId}/change-requests/${e.target.attributes.itemID.value}`);
    }
  };

  return (
    <>
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={styles.buttonsContainer}>
          <Button onClick={() => alert('Under utvikling')}>{loc.suggestionForNewConcept}</Button>
        </div>
        <div className={styles.listWrapper}>
          <List onClick={handleListItemClick}>
            {changeRequests.map((changeRequest) => (
              <ListItem
                key={changeRequest.id}
                itemID={changeRequest.id}
                title={changeRequest.catalogId}
              >
                {changeRequest.id}
              </ListItem>
            ))}
          </List>
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
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const organization: Organization = await getOrganization(catalogId);

  return {
    props: {
      organization,
    },
  };
}

export default ChangeRequestsPage;
