import { render } from '@testing-library/react';
import React from 'react';

import FormLayout from './index';

describe('FormLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormLayout children={<p>form</p>} />);
    expect(baseElement).toBeTruthy();
  });
});
