import { render } from "@testing-library/react";

import { Footer } from "./";

describe("Footer", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
