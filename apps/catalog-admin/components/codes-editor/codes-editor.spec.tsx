import { render } from '@testing-library/react';
import CodesEditor from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

const codeList = {
  id: 'fc4d43e1-ea1e-430b-9116-762cffad69aa',
  name: 'Kodeliste 1',
  catalogId: '910244132',
  description: 'Ny beskrivelse 1',
  codes: [
    {
      id: 13,
      name: {
        nb: 'Forelder lv 1',
        nn: '',
        en: '',
      },
      parentID: 17,
    },
  ],
};

describe('CodesEditor', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <CodesEditor codeList={codeList} />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
