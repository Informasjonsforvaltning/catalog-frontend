import { parseInformationModelToBeCreated } from "./parse-information-model-to-be-created";

describe("parseInformationModelToBeCreated", () => {
  it("accepts a minimal model with a title", () => {
    expect(
      parseInformationModelToBeCreated({ title: { nb: "Tittel" } }),
    ).toEqual(expect.objectContaining({ title: { nb: "Tittel" } }));
  });

  it("keeps known fields and drops unknown ones", () => {
    const parsed = parseInformationModelToBeCreated({
      title: { nb: "Tittel" },
      description: { nb: "Beskrivelse" },
      contactPoints: [{ name: { nb: "Kontakt" }, email: "a@example.com" }],
      version: { major: 1, minor: 2, patch: 3 },
      subjects: ["https://example.com/subject"],
      id: "should-be-dropped",
      published: true,
    });

    expect(parsed).toEqual(
      expect.objectContaining({
        title: { nb: "Tittel" },
        description: { nb: "Beskrivelse" },
        contactPoints: [
          {
            name: { nb: "Kontakt" },
            email: "a@example.com",
            telephone: undefined,
            url: undefined,
          },
        ],
        version: { major: 1, minor: 2, patch: 3 },
        subjects: ["https://example.com/subject"],
      }),
    );
    expect(parsed).not.toHaveProperty("id");
    expect(parsed).not.toHaveProperty("published");
  });

  it("accepts null for nullable fields", () => {
    expect(
      parseInformationModelToBeCreated({
        title: { en: "Title" },
        description: null,
        contactPoints: null,
        version: null,
      }),
    ).not.toBeNull();
  });

  it.each([
    ["a non-object body", "title"],
    ["an array body", [{ title: { nb: "Tittel" } }]],
    ["a missing title", {}],
    ["a title that is not an object", { title: "Tittel" }],
    ["a title without text", { title: { nb: "", en: "" } }],
    ["a title with a non-string value", { title: { nb: 42 } }],
    ["a non-array contactPoints", { title: { nb: "T" }, contactPoints: {} }],
    [
      "a contact point with a non-string email",
      { title: { nb: "T" }, contactPoints: [{ email: 1 }] },
    ],
    [
      "an incomplete version",
      { title: { nb: "T" }, version: { major: 1, minor: 0 } },
    ],
    ["a non-string status", { title: { nb: "T" }, status: 1 }],
    ["non-string subjects", { title: { nb: "T" }, subjects: [1] }],
  ])("rejects %s", (_description, body) => {
    expect(parseInformationModelToBeCreated(body)).toBeNull();
  });
});
