import { render } from '@testing-library/react';
import { RouteGuard } from '.';
import React from 'react';

describe('RouteGuard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RouteGuard children={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
