import { localization } from '@catalog-frontend/utils';
import { useRouter } from 'next/router';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Breadcrumbs, { BreadcrumbType } from '../breadcrumbs';
import { PageBanner } from '../page-banner';
import { Heading } from '@digdir/design-system-react';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';

interface Props extends WithRouterProps {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const catalogId = (this.props.router.query.catalogId as string) ?? '';
      const breadcrumbList = catalogId
        ? ([
            {
              href: `/${catalogId}`,
              text: localization.catalogType.concept,
            },
          ] as BreadcrumbType[])
        : [];

      const pageSubtitle = 'Feil';

      return (
        <>
          <Breadcrumbs breadcrumbList={breadcrumbList} />
          <PageBanner
            title={localization.catalogType.concept}
            subtitle={pageSubtitle}
          />
          <div className='container grow center'>
            <Heading
              level={2}
              size='small'
            >
              {localization.somethingWentWrong}
            </Heading>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);