import { render } from "@testing-library/react";

import React from "react";
import ReferenceDataSuggestionSelect from "./index";

describe("ReferenceDataSuggestionSelect", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <ReferenceDataSuggestionSelect
        selectedValuesSearchHits={[]}
        querySearchHits={[]}
        formikValues={[]}
        onSearch={jest.fn()}
        onValueChange={jest.fn()}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
