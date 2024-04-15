import React from 'react';
import { render } from '@testing-library/react';
import { SearchHit } from './';

describe('SearchHit', () => {
  it('should render SearchHit with empty title successfully', () => {
    const { baseElement } = render(<SearchHit title={''} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
