import { render } from "@testing-library/react";
import { DividerLine } from ".";

describe("DividerLine", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<DividerLine />);
    expect(baseElement).toBeTruthy();
  });
});
