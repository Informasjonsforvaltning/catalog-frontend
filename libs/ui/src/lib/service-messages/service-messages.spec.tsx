import { render } from "@testing-library/react";
import { ServiceMessages } from "./index";

describe("ServiceMessages", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <ServiceMessages
        serviceMessages={[
          {
            id: "40",
            attributes: {
              title: "TEST - driftsmelding WARNING",
              valid_from: "2024-08-27T22:00:00.000Z",
              valid_to: "2024-08-29T22:00:00.000Z",
              message_type: "WARNING",
              short_description:
                "Dette er en test av driftsmelding - warning på staging. Gjelder registreringsløsningen.",
              description: "Her kan det legges ut mer tekst/beskrivelse.",
              environment: "staging",
              channel_publiseringportal: null,
              locale: "nb-NO",
            },
          },
        ]}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
