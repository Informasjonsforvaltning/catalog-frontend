import React from 'react';
import { render } from '@testing-library/react';
import { SearchHitsPageLayout } from '../search-hits-page-layout';

describe('SearchHitsPageLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SearchHitsPageLayout>
        {
          <SearchHitsPageLayout.MainColumn>
            <p>Test</p>
          </SearchHitsPageLayout.MainColumn>
        }
      </SearchHitsPageLayout>,
    );
    expect(baseElement).toBeTruthy();
  });
});
