import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchHitTable } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe('SearchHitTable', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <SearchHitTable
          datasets={[
            {
              id: '123',
              catalogId: '456',
              uri: 'dataset.no',
              _lastModified: '2024-07-09T12:55:56.501',
              title: { nb: 'Dataset' },
            },
          ]}
        />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
