import { render } from "@testing-library/react";
import { CodeListEditor } from ".";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

const codeList = {
  id: "fc4d43e1-ea1e-430b-9116-762cffad69aa",
  name: "Kodeliste 1",
  catalogId: "910244132",
  description: "Ny beskrivelse 1",
  codes: [
    {
      id: "72d0e06d-daf1-4de5-8885-56b810c69105",
      name: {
        nb: "Forelder lv 1",
        nn: "",
        en: "",
      },
      parentID: null,
    },
    {
      id: "101e0f67-f8cd-4f75-9320-0f2198a7943a",
      name: {
        nb: "Barn lv 1",
        nn: "",
        en: "",
      },
      parentID: "72d0e06d-daf1-4de5-8885-56b810c69105",
    },
  ],
};

describe("CodeListEditor", () => {
  it("should render successfully", () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <CodeListEditor
          codeList={codeList}
          codeListsInUse={[codeList.id]}
          catalogId="910244132"
        />
      </QueryClientProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
