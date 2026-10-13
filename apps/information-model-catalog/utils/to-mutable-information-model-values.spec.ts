jest.mock("@catalog-frontend/utils", () => ({
  normalizeVersion: jest.requireActual("../../../libs/utils/src/lib/version")
    .normalizeVersion,
  removeEmptyValues: jest.requireActual(
    "../../../libs/utils/src/lib/object-manipulation",
  ).removeEmptyValues,
}));

import { compare } from "fast-json-patch";
import {
  InformationModel,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";
import { toMutableInformationModelValues } from "./to-mutable-information-model-values";

const baseServerModel = {
  id: "c40dfa35-5753-4db9-a918-2257ee0b32c9",
  catalogId: "555111098",
  published: false,
  title: { nb: "Modell" },
  description: { nb: "Beskrivelse" },
  contactPoints: null,
  status: null,
  homepage: null,
  version: null,
  creator: null,
  subjects: null,
  issued: null,
  modified: null,
} as InformationModel;

const baseFormValues = {
  title: { nb: "Modell" },
  description: { nb: "Beskrivelse" },
  contactPoints: [{ name: {} }],
  status: "",
  homepage: "",
  version: null,
  creator: "",
  subjects: [],
  issued: "",
  modified: "",
} as InformationModelToBeCreated;

describe("toMutableInformationModelValues", () => {
  test("treats null and empty subjects as equal so compare emits no subjects op", () => {
    const diff = compare(
      toMutableInformationModelValues(baseServerModel),
      toMutableInformationModelValues(baseFormValues),
    );

    expect(diff.filter((op) => op.path.startsWith("/subjects"))).toEqual([]);
  });

  test("replaces subjects when stored value is null instead of adding into a null array", () => {
    const formWithSubject = {
      ...baseFormValues,
      subjects: ["https://example.com/concepts/1"],
    };

    const diff = compare(
      toMutableInformationModelValues(baseServerModel),
      toMutableInformationModelValues(formWithSubject),
    );

    expect(diff).toContainEqual({
      op: "replace",
      path: "/subjects",
      value: ["https://example.com/concepts/1"],
    });
    expect(diff.some((op) => op.path === "/subjects/0")).toBe(false);
  });

  test("appends to an existing subjects array with element ops", () => {
    const initial = {
      ...baseServerModel,
      subjects: ["https://example.com/concepts/1"],
    };
    const updated = {
      ...baseFormValues,
      subjects: [
        "https://example.com/concepts/1",
        "https://example.com/concepts/2",
      ],
    };

    const diff = compare(
      toMutableInformationModelValues(initial),
      toMutableInformationModelValues(updated),
    );

    expect(diff).toContainEqual({
      op: "add",
      path: "/subjects/1",
      value: "https://example.com/concepts/2",
    });
  });

  test("does not emit nested title ops when stored title is null", () => {
    const initial = {
      ...baseServerModel,
      title: null as unknown as InformationModel["title"],
    };
    const updated = {
      ...baseFormValues,
      title: { nb: "Ny tittel" },
    };

    const diff = compare(
      toMutableInformationModelValues(initial),
      toMutableInformationModelValues(updated),
    );

    expect(diff).toContainEqual({
      op: "replace",
      path: "/title",
      value: { nb: "Ny tittel" },
    });
    expect(diff.some((op) => op.path.startsWith("/title/"))).toBe(false);
  });

  test("sets modified when a date is entered", () => {
    const diff = compare(
      toMutableInformationModelValues(baseServerModel),
      toMutableInformationModelValues({
        ...baseFormValues,
        modified: "2026-03-15",
      }),
    );

    expect(diff).toContainEqual({
      op: "replace",
      path: "/modified",
      value: "2026-03-15",
    });
  });

  test("removes modified when the date is cleared", () => {
    const diff = compare(
      toMutableInformationModelValues({
        ...baseServerModel,
        modified: "2026-03-15",
      }),
      toMutableInformationModelValues(baseFormValues),
    );

    expect(diff).toContainEqual({ op: "remove", path: "/modified" });
  });

  test("sets issued when a date is entered", () => {
    const diff = compare(
      toMutableInformationModelValues(baseServerModel),
      toMutableInformationModelValues({
        ...baseFormValues,
        issued: "2026-01-10",
      }),
    );

    expect(diff).toContainEqual({
      op: "replace",
      path: "/issued",
      value: "2026-01-10",
    });
  });

  test("removes issued when the date is cleared", () => {
    const diff = compare(
      toMutableInformationModelValues({
        ...baseServerModel,
        issued: "2026-01-10",
      }),
      toMutableInformationModelValues(baseFormValues),
    );

    expect(diff).toContainEqual({ op: "remove", path: "/issued" });
  });
});
