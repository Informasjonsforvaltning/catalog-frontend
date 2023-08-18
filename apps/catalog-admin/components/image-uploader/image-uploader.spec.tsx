// import { render } from '@testing-library/react';

// import ImageUploader from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe('ImageUploader', () => {
  it('should render successfully', () => {
    // const { baseElement } = render(<ImageUploader />);
    // expect(baseElement).toBeTruthy();
  });
});
