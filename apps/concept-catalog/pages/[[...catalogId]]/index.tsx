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
import {authOptions} from '../api/auth/[...nextauth]';
import {
  action,
  searchConceptsForCatalog,
  useConceptDispatch,
} from '@catalog-frontend/data-access';
import {Concept, ConceptHitPageProps} from '@catalog-frontend/types';
import {useEffect} from 'react';

interface SearchConceptResponseProps {
  hits: Concept[];
  page: ConceptHitPageProps;
}
interface SearchPageProps {
  catalogId: string;
  searchConceptResponse: SearchConceptResponseProps;
}

export const SearchPage = ({
  catalogId,
  searchConceptResponse,
}: SearchPageProps) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  const pageSubtitle = catalogId ?? 'No title';
  let conceptState = undefined;
  const dispatch = useConceptDispatch();

  if (Object.entries(searchConceptResponse).length !== 0) {
    conceptState = {
      catalogId: catalogId,
      concepts: searchConceptResponse.hits,
      page: searchConceptResponse.page,
    };
  }

  useEffect(() => {
    dispatch(action('POPULATE', conceptState));
  }, []);

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
            bg="#2d3741"
            btnType="filled"
            iconPos="left"
            startIcon={<Icon name="circlePlusStroke" />}
          />
          <Button
            name={localization.button.importConcept}
            bg="#2e6773"
            btnType="filled"
          />
        </SC.ContainerOne>
      </SC.SearchPage>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  const {accessToken} = session.user;
  let catalogId = '';
  let searchConceptResponse: SearchConceptResponseProps;

  try {
    catalogId = query.catalogId[0];
  } catch (error) {
    console.log(error);
  }

  if (catalogId) {
    searchConceptResponse = await searchConceptsForCatalog(
      catalogId,
      accessToken
    );
  }

  if (!searchConceptResponse) {
    searchConceptResponse = {} as SearchConceptResponseProps;
  }

  return {
    props: {
      session,
      catalogId,
      searchConceptResponse,
    },
  };
};

export default SearchPage;
