import { render } from "@testing-library/react";
import ImageUploader from ".";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe("ImageUploader", () => {
  it("should render successfully", () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <ImageUploader catalogId="123456789" />
      </QueryClientProvider>,
    );
    expect(baseElement).toBeTruthy();
  });
});
