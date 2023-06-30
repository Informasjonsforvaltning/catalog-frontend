import { render } from '@testing-library/react';

import { Chips } from './';
import React from 'react';

describe('Chips', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Chips />);
    expect(baseElement).toBeTruthy();
  });
});
