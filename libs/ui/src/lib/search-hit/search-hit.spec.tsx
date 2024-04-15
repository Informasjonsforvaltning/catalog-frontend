import React from 'react';
import { render } from '@testing-library/react';
import { SearchHit } from './';

describe('SearchHit', () => {
  it('should render SearchHit successfully', () => {
    const { baseElement } = render(
      <SearchHit
        title={'Search hit title'}
        description={'Search hit description'}
        content={'Search hit content'}
        statusTag={'Search hit status tag'}
        titleHref={'Search hit title href'}
        conceptSubject={'Search hit concept subject'}
        labels={'Search hit labels'}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
