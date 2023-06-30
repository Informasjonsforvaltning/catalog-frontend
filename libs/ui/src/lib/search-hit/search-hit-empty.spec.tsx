import React from 'react';
import { render } from '@testing-library/react';
import { SearchHit } from './';

describe('SearchHit', () => {
  it('should render SearchHit with undefined input successfully', () => {
    const { baseElement } = render(
      <SearchHit
        searchHit={{}}
        catalogId={''}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
