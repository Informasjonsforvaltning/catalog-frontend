import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Banner } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe('Banner', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <Banner
          title='title'
          orgName='my organization'
          catalogId='123456789'
        />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
