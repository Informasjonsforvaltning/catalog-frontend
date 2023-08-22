import { getChangeRequests, getOrganization } from '@catalog-frontend/data-access';
import { ChangeRequest, Organization } from '@catalog-frontend/types';
import { Button, List, ListItem, PageBanner } from '@catalog-frontend/ui';
import {
  hasOrganizationReadPermission,
  localization as loc,
  validChangeRequestId,
  validOrganizationNumber,
} from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/router';
import { useDeleteChangeRequest } from 'apps/concept-catalog/hooks/change-requests';

export const ChangeRequestsPage = ({ organization, changeRequests }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const deleteChangeRequest = useDeleteChangeRequest(catalogId);

  const handleListItemClick = (e) => {
    if (
      validOrganizationNumber(router.query.catalogId.toString()) &&
      validChangeRequestId(changeRequests, e.target.attributes.itemID.value)
    ) {
      router.push(`/catalog/${router.query.catalogId}/change-requests/${e.target.attributes.itemID.value}`);
    }
  };

  const handleDeleteChangeRequest = (changeRequestId: string) => {
    if (window.confirm('Er du sikker på at du vil slette dette endringsforslaget?')) {
      deleteChangeRequest.mutate(changeRequestId);
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

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const changeRequests: ChangeRequest[] = await getChangeRequests(catalogId, `${token.access_token}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`getChangeRequests failed with status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });

  return {
    props: {
      organization,
      changeRequests,
    },
  };
}

export default ChangeRequestsPage;
