import { render } from "@testing-library/react";
import { SearchHitsLayout } from "../search-hits-layout";

describe("SearchHitsPageLayout", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <SearchHitsLayout>
        {
          <SearchHitsLayout.MainColumn>
            <p>Test</p>
          </SearchHitsLayout.MainColumn>
        }
      </SearchHitsLayout>,
    );
    expect(baseElement).toBeTruthy();
  });
});
