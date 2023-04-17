import { render } from '@testing-library/react';

import RouteGuard from './route-guard';

describe('RouteGuard', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<RouteGuard />);
    expect(baseElement).toBeTruthy();
  });
  
});
