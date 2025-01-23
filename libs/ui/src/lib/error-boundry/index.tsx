'use client';

import { localization } from '@catalog-frontend/utils';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { PageBanner } from '../page-banner';
import { Heading } from '@digdir/designsystemet-react';
import { CenterContainer } from '../center-container';

interface Props {
  children?: ReactNode;
  fdkRegistrationBaseUrl?: string | undefined;
  title?: string | undefined;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private fdkRegistrationBaseUrl: string | undefined;
  private title: string | undefined;

  constructor(props: Props) {
    super(props);
    this.fdkRegistrationBaseUrl = props.fdkRegistrationBaseUrl;
    this.title = props.title;
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
      const pageSubtitle = 'Feil';

      return (
        <>
          <Breadcrumbs
            breadcrumbList={[]}
            catalogPortalUrl={`${this.fdkRegistrationBaseUrl ?? '/catalogs'}`}
          />
          <PageBanner
            title={this.title ?? 'Feil'}
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
