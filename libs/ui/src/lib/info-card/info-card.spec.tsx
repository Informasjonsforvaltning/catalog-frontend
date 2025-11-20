import { render } from "@testing-library/react";
import { InfoCard } from "./info-card";

/* eslint-disable-next-line react/display-name */
jest.mock("react-markdown", () => (props: any) => <div {...props} />);

describe("CardList", () => {
  const cardList = (
    <InfoCard>
      <InfoCard.Item>Item #1</InfoCard.Item>
      <InfoCard.Item>Item #2</InfoCard.Item>
    </InfoCard>
  );

  it("should render successfully", () => {
    const { baseElement } = render(cardList);
    expect(baseElement).toBeTruthy();
  });
});
