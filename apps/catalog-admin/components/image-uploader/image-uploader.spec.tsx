import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ImageUploader from ".";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { localization } from "@catalog-frontend/utils";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

jest.mock("@catalog-frontend/utils", () => ({
  ...jest.requireActual("@catalog-frontend/utils"),
  // jsdom can't decode images, so accept any file in these tests
  validateImageFile: jest.fn().mockResolvedValue(true),
}));

const catalogId = "123456789";

const renderUploader = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ImageUploader catalogId={catalogId} />
    </QueryClientProvider>,
  );
};

// jsdom has no global Response, so return a minimal response-like object.
// GET always returns 404 (no existing logo); POST returns `postStatus`.
const mockFetch = (postStatus: number) =>
  jest.fn((_url: string, init?: RequestInit) => {
    const status = init?.method === "POST" ? postStatus : 404;
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: "",
      headers: new Headers(),
      text: () => Promise.resolve(""),
    });
  });

// Install via defineProperty: the mock returns a response-like object rather
// than a real Response, which doesn't match the global fetch type.
const installFetch = (postStatus: number) => {
  const fetchMock = mockFetch(postStatus);
  Object.defineProperty(global, "fetch", {
    value: fetchMock,
    writable: true,
    configurable: true,
  });
  return fetchMock;
};

const selectFile = (container: HTMLElement, name: string) => {
  const input = container.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("File input not found");
  }
  const file = new File(["<svg></svg>"], name, { type: "image/svg+xml" });
  fireEvent.change(input, { target: { files: [file] } });
};

describe("ImageUploader", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    URL.createObjectURL = jest.fn(() => "blob:preview");
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render successfully", () => {
    installFetch(200);
    const { baseElement } = renderUploader();
    expect(baseElement).toBeTruthy();
  });

  it("shows the selected file when the upload succeeds", async () => {
    const fetchMock = installFetch(200);
    const { container } = renderUploader();

    selectFile(container, "logo.svg");

    expect(await screen.findByText("logo.svg")).toBeTruthy();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/design/${catalogId}/logo`,
        expect.objectContaining({ method: "POST" }),
      ),
    );
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("alerts and removes the preview when the upload fails", async () => {
    installFetch(500);
    const { container } = renderUploader();

    selectFile(container, "logo.svg");

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(localization.alert.updateFailed),
    );
    expect(screen.queryByText("logo.svg")).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });
});
