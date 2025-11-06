import { render } from "@testing-library/react";
import { ColorPicker } from ".";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

describe("ColorPicker", () => {
  it("should render successfully", () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <ColorPicker catalogId="test-catalog" type="background" />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
