import {useRouter} from 'next/router';
import {
  Breadcrumbs,
  breadcrumbT,
  PageTitle,
  PageSubtitle,
  Button,
  Icon,
} from '@catalog-frontend/ui';
import {localization} from '@catalog-frontend/utils';
import SC from '../../styles/overview-page';

export const OverviewPage = () => {
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
      <SC.OverviewPage>
        <SC.ContainerOne>
          <div>
            <PageTitle>{localization.catalogType.concept}</PageTitle>
            <PageSubtitle>{pageSubtitle}</PageSubtitle>
          </div>
          <Button
            name={localization.button.addConcept}
            btnType="filled"
            iconPos="left"
            startIcon={<Icon name="circlePlusStroke" />}
          />
          <Button
            name={localization.button.importConcept}
            btnType="filled"
          />
        </SC.ContainerOne>
      </SC.OverviewPage>
    </>
  );
};

export default OverviewPage;
