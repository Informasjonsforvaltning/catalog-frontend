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
          dataServices={[
            {
              id: '123',
              modified: '2024-07-09T12:55:56.501',
              organizationId: '987654321',
              title: { nb: 'Datatjeneste' },
              description: { nb: 'En datatjeneste' },
              status: 'PUBLISHED',
            },
          ]}
        />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
