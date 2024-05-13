import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserEditor } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe('UserEditor', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <UserEditor catalogId='12345' />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
