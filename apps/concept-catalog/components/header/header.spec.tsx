import { render } from '@testing-library/react';

import Header from './header';

describe('RouteGuard', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();
  });
  
});
