import {useRouter} from 'next/router';
import {
  Breadcrumbs,
  breadcrumbT,
  PageTitle,
  PageSubtitle,
} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/search-page';

export const SearchPage = () => {
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
        <PageTitle>{localization.catalogType.concept}</PageTitle>
        <PageSubtitle>{pageSubtitle}</PageSubtitle>
      </SC.SearchPage>
    </>
  );
};

export default SearchPage;
