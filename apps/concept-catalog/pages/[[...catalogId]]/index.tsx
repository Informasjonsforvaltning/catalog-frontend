import {useRouter} from 'next/router';
import {Breadcrumbs, breadcrumbT} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';

export const Index = () => {
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

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
    </>
  );
};

export default Index;
