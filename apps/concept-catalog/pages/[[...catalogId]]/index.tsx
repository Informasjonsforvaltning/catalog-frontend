import {useRouter} from 'next/router';
import {Colour, theme} from '@fellesdatakatalog/theme';
import {getServerSession} from 'next-auth/next';

import {
  Breadcrumbs,
  breadcrumbT,
  PageTitle,
  PageSubtitle,
  Button,
  Icon,
} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/search-page';
import {GetServerSideProps} from 'next';
import type {Session} from 'next-auth';
import {authOptions} from '../api/auth/[...nextauth]';

export const SearchPage = (session: Session) => {
  const router = useRouter();
  const {catalogId} = router.query;

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  const pageSubtitle = catalogId ?? 'No title';

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <SC.SearchPage>
        <SC.ContainerOne>
          <div>
            <PageTitle>{localization.catalogType.concept}</PageTitle>
            <PageSubtitle>{pageSubtitle}</PageSubtitle>
          </div>
          <Button
            name={localization.button.addConcept}
            bg={theme.colour(Colour.NEUTRAL, 'N60')}
            btnType="filled"
            iconPos="left"
            startIcon={<Icon name="circlePlusStroke" />}
          />
          <Button
            name={localization.button.importConcept}
            bg={theme.colour(Colour.GREEN, 'G60')}
            btnType="filled"
          />
        </SC.ContainerOne>
      </SC.SearchPage>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default SearchPage;
