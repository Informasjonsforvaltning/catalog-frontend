'use client';

import { localization } from '@catalog-frontend/utils';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';
import { PageBanner } from '../page-banner';
import { Heading } from '@digdir/designsystemet-react';
import { CenterContainer } from '../center-container';

interface Props {
  children?: ReactNode;
  FDK_REGISTRATION_BASE_URI?: string;
  catalogId?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private FDK_REGISTRATION_BASE_URI: string | undefined;
  private catalogId: string | undefined;

  constructor(props: Props) {
    super(props);
    this.FDK_REGISTRATION_BASE_URI = props.FDK_REGISTRATION_BASE_URI;
    this.catalogId = props.catalogId;
  }

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
      const breadcrumbList = this.catalogId
        ? ([
            {
              href: `/${this.catalogId}`,
              text: localization.catalogType.concept,
            },
          ] as BreadcrumbType[])
        : [];

      const pageSubtitle = 'Feil';

      return (
        <>
          <Breadcrumbs
            baseURI={this.FDK_REGISTRATION_BASE_URI}
            breadcrumbList={breadcrumbList}
          />
          <PageBanner
            title={localization.catalogType.concept}
            subtitle={pageSubtitle}
          />
          <CenterContainer>
            <Heading
              level={2}
              size='small'
            >
              {localization.somethingWentWrong}
            </Heading>
          </CenterContainer>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
