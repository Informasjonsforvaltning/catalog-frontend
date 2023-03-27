import { render } from '@testing-library/react';
import React from 'react';

import Root from './';

describe('Root', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<Root />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  
});
