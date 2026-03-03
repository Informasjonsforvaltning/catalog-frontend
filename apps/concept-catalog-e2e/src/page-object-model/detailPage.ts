import {
  expect,
  Page,
  BrowserContext,
  APIRequestContext,
} from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import EditPage from "./editPage";
import {
  Concept,
  Definisjon,
  RelationSubtypeEnum,
  RelationTypeEnum,
  UnionRelation,
} from "@catalog-frontend/types";
import { formatISO } from "@catalog-frontend/utils";
import { getFields, getUsers, relationToSourceText } from "../utils/helpers";

export default class DetailPage {
  url: string;
  page: Page;
  editPage: EditPage;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts`;
    this.page = page;
    this.editPage = new EditPage(page, context, accessibilityBuilder);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  // Locators
  pageTitleLocator = () => this.page.getByRole("heading", { name: "" });
  pageDescriptionLocator = () => this.page.getByText("");

  public async goto(url: string) {
    await this.page.goto(url);
    // Wait for page to load by checking for key element
    await expect(
      this.page.getByRole("button", { name: "Rediger" }),
    ).toBeVisible();
  }

  public async editConcept() {
    const editButton = this.page.getByRole("button", { name: "Rediger" });
    await expect(editButton).toBeVisible();
    await editButton.click();
    await this.editPage.expectMenu();
  }

  public async deleteConcept() {
    await this.page.getByRole("button", { name: "Slett" }).click();
    await expect(this.page.getByRole("button", { name: "Slett" })).toBeHidden({
      timeout: 5000,
    });
  }

  public async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(["svg-img-alt", "aria-toggle-field-name"])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }

  public async checkPageTitleText() {
    await expect(this.pageTitleLocator()).toHaveText("");
  }

  public async checkPageDescriptionText() {
    await expect(this.pageDescriptionLocator()).toHaveText("");
  }

  public async checkIfNoConceptsExist() {
    const items = (await this.page.getByRole("link").all()).filter(
      async (link) => {
        (await link.getAttribute("href"))?.startsWith(this.url);
      },
    );

    expect(items.length).toBe(0);
  }

  getStatusText(uri: string) {
    if (uri.includes("DRAFT")) {
      return "utkast";
    } else if (uri.includes("CURRENT")) {
      return "gjeldende";
    } else if (uri.includes("REJECTED")) {
      return "avvist";
    }
    return "ukjent";
  }

  getStatusColor(uri: string) {
    if (uri.includes("DRAFT")) {
      return "rgb(250, 230, 198)";
    } else if (uri.includes("CURRENT")) {
      return "rgb(218, 237, 221)";
    } else if (uri.includes("REJECTED")) {
      return "rgb(248, 228, 228)";
    }
    return "ukjent";
  }

  getDefinitionSourceText(def?: Definisjon) {
    const text = relationToSourceText(def?.kildebeskrivelse?.forholdTilKilde);
    return def?.kildebeskrivelse?.forholdTilKilde === "egendefinert"
      ? text
      : `${text}:`;
  }

  getVersionText(concept: Concept) {
    return `${concept.versjonsnr?.major}.${concept.versjonsnr?.minor}.${concept.versjonsnr?.patch}`;
  }

  async expectHeading(concept: Concept) {
    console.log(
      "[DETAIL PAGE] Checking heading for concept:",
      concept.anbefaltTerm?.navn.nb,
    );
    await expect(
      this.page.getByRole("heading", {
        name: concept.anbefaltTerm?.navn.nb as string,
      }),
    ).toBeVisible();

    const heading = this.page.getByRole("heading", {
      name: concept.anbefaltTerm?.navn.nb as string,
    });
    const statusTag = this.page
      .locator("div")
      .filter({ has: heading })
      .last()
      .getByText(this.getStatusText(concept.statusURI as string), {
        exact: true,
      });
    await expect(statusTag).toBeVisible();

    const backgroundColor = await statusTag.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe(
      this.getStatusColor(concept.statusURI as string),
    );
    console.log("[DETAIL PAGE] Heading and status checked.");
  }

  async expectActionButtons() {
    console.log("[DETAIL PAGE] Checking action buttons...");
    await expect(
      this.page.getByRole("button", { name: "Rediger" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Slett" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Foreslå endring" }),
    ).toBeVisible();
    console.log("[DETAIL PAGE] Action buttons checked.");
  }

  async expectLanguageCombobox() {
    console.log("[DETAIL PAGE] Checking language combobox...");
    const languageCombobox = this.page.getByRole("combobox");
    await expect(languageCombobox).toBeVisible();
    await expect(languageCombobox).toHaveValue("nb");
    console.log("[DETAIL PAGE] Language combobox checked.");
  }

  async expectLeftColumnContent(
    concept: Concept,
    apiRequestContext: APIRequestContext,
  ) {
    console.log("[DETAIL PAGE] Checking left column content...");
    await expect(
      this.page
        .locator("div")
        .filter({
          hasText: new RegExp(
            `Definisjon:${concept.definisjon?.tekst.nb}${this.getDefinitionSourceText(concept.definisjon)}`,
          ),
        })
        .first(),
    ).toBeVisible();

    await expect(
      this.page
        .locator("div")
        .filter({
          hasText: new RegExp(
            `^Tillatt term:${concept.tillattTerm?.nb.join("")}$`,
          ),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.tillattTerm?.nb) });

    await expect(
      this.page
        .locator("div")
        .filter({
          hasText: new RegExp(
            `^Frarådet term:${concept.frarådetTerm?.nb.join("")}$`,
          ),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.frarådetTerm?.nb) });

    await expect(
      this.page
        .locator("div")
        .filter({
          hasText: new RegExp(`^Merknad:${concept.merknad?.nb}$`),
        })
        .first(),
    ).toBeVisible({ visible: Boolean(concept.merknad?.nb) });

    await expect(
      this.page.getByText(`Forkortelse:${concept.abbreviatedLabel}`),
    ).toBeVisible({
      visible: Boolean(concept.abbreviatedLabel),
    });

    const relations: UnionRelation[] = [
      ...(concept.begrepsRelasjon?.map((rel) => ({ ...rel })) ?? []),
      ...(concept.seOgså
        ? concept.seOgså.map((concept) => ({
            relasjon: RelationTypeEnum.SE_OGSÅ,
            relatertBegrep: concept,
          }))
        : []),
      ...(concept.erstattesAv
        ? concept.erstattesAv.map((concept) => ({
            relasjon: RelationTypeEnum.ERSTATTES_AV,
            relatertBegrep: concept,
          }))
        : []),
    ];

    const internalRelations = [
      ...(concept.internBegrepsRelasjon
        ? concept.internBegrepsRelasjon.map((rel) => ({
            ...rel,
            internal: true,
          }))
        : []),
      ...(concept.internSeOgså
        ? concept.internSeOgså.map((concept) => ({
            relasjon: RelationTypeEnum.SE_OGSÅ,
            relatertBegrep: concept,
            internal: true,
          }))
        : []),
      ...(concept.internErstattesAv
        ? concept.internErstattesAv.map((concept) => ({
            relasjon: RelationTypeEnum.ERSTATTES_AV,
            relatertBegrep: concept,
            internal: true,
          }))
        : []),
    ];

    const allRelations: UnionRelation[] = [...relations, ...internalRelations];

    if (relations.length > 0) {
      console.log(
        `[DETAIL PAGE] Checking published relations (${relations.length})...`,
      );
      await expect(
        this.page.getByRole("heading", {
          name: `Relaterte begreper (${relations.length})`,
        }),
      ).toBeVisible();
    }

    if (internalRelations.length > 0) {
      console.log(
        `[DETAIL PAGE] Checking internal relations (${internalRelations.length})...`,
      );
      await expect(
        this.page.getByRole("heading", {
          name: `Relaterte begreper - upubliserte (${internalRelations.length})`,
        }),
      ).toBeVisible();
    }

    for (let i = 0; i < allRelations.length; i++) {
      const rel = allRelations[i];
      if (rel.relasjon === RelationTypeEnum.ASSOSIATIV) {
        await expect(
          this.page.getByText(
            `Assosiativ relasjon${rel.beskrivelse?.nb}${rel.internal ? "InternRel" : "PublisertRel"}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.GENERISK) {
        const subtype =
          rel.relasjonsType === RelationSubtypeEnum.OVERORDNET
            ? "Overordnet"
            : "Underordnet";
        await expect(
          this.page.getByText(
            `Generisk relasjon${subtype} (Inndelingskriterium: ${rel.inndelingskriterium?.nb})${rel.internal ? "InternRel" : "PublisertRel"}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.PARTITIV) {
        const subtype =
          rel.relasjonsType === RelationSubtypeEnum.OMFATTER
            ? "Omfatter"
            : "Er del av";
        await expect(
          this.page.getByText(
            `Partitiv relasjon${subtype} (Inndelingskriterium: ${rel.inndelingskriterium?.nb})${rel.internal ? "InternRel" : "PublisertRel"}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.SE_OGSÅ) {
        await expect(
          this.page.getByText(
            `Se også${rel.internal ? "InternRel" : "PublisertRel"}`,
          ),
        ).toBeVisible();
      } else if (rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
        await expect(
          this.page.getByText(
            `Erstattes av${rel.internal ? "InternRel" : "PublisertRel"}`,
          ),
        ).toBeVisible();
      }
    }

    const { users } = await getUsers(apiRequestContext);
    const fields = await getFields(apiRequestContext);
    for (const field of fields.internal) {
      if (field.type === "text_short" || field.type === "text_long") {
        await expect(
          this.page.getByText(
            `${field.label?.nb}:${concept.interneFelt?.[field.id].value}`,
          ),
        ).toBeVisible();
      } else if (field.type === "boolean") {
        await expect(
          this.page.getByText(
            `${field.label?.nb}:${concept.interneFelt?.[field.id].value === "true" ? "Ja" : "Nei"}`,
          ),
        ).toBeVisible();
      } else if (field.type === "code_list") {
        //TODO support code lists
      } else if (field.type === "user_list") {
        const user = users.find(
          (u) => u.id === concept.interneFelt?.[field.id].value,
        );
        await expect(
          this.page.getByText(`${field.label?.nb}:${user?.name}`),
        ).toBeVisible();
      }
    }
    console.log("[DETAIL PAGE] Left column content checked.");
  }

  async expectCommentsTab() {
    console.log("[DETAIL PAGE] Checking comments tab...");
    const tab = this.page.getByRole("tab", { name: "Kommentarer" });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(this.page.getByLabel("Legg til kommentar")).toBeVisible();
    await expect(this.page.getByText("Kommentarer (0)")).toBeVisible();
    console.log("[DETAIL PAGE] Comments tab checked.");
  }

  async expectHistoryTab() {
    console.log("[DETAIL PAGE] Checking history tab...");
    const tab = this.page.getByRole("tab", { name: "Endringshistorikk" });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(
      this.page
        .getByRole("button", {
          name: `LAMA LEDENDE ${formatISO(new Date().toISOString(), {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
        })
        .first(),
    ).toBeVisible();
    console.log("[DETAIL PAGE] History tab checked.");
  }

  async expectVersionTab({ anbefaltTerm, versjonsnr, statusURI }: Concept) {
    console.log("[DETAIL PAGE] Checking version tab...");
    const tab = this.page.getByRole("tab", { name: "Versjoner" });
    await expect(tab).toBeVisible();
    tab.click();

    await expect(
      this.page
        .locator("div")
        .filter({
          hasText: new RegExp(
            `^Versjons-ID ([a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+)v${versjonsnr?.major}\\.${versjonsnr?.minor}\\.${versjonsnr?.patch}${anbefaltTerm?.navn.nb}${this.getStatusText(statusURI as string)}$`,
          ),
        })
        .nth(2),
    ).toBeVisible();
    console.log("[DETAIL PAGE] Version tab checked.");
  }

  async expectRightColumnContent(
    concept: Concept,
    apiRequestContext: APIRequestContext,
  ) {
    console.log("[DETAIL PAGE] Checking right column content...");
    await expect(
      this.page.getByRole("heading", { name: "Begreps-ID" }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/,
      ),
    ).toBeVisible();

    await expect(
      this.page.getByRole("heading", { name: "Publiseringstilstand" }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        concept.erPublisert
          ? "Publisert i felles datakatalog"
          : "Ikke publisert",
      ),
    ).toBeVisible();

    const versionHeading = this.page.getByRole("heading", {
      name: "Versjon",
    });
    await expect(versionHeading).toBeVisible();
    const versionContainer = this.page
      .locator("div")
      .filter({ has: versionHeading })
      .last();
    await expect(
      versionContainer.getByText(this.getVersionText(concept), { exact: true }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("heading", { name: "Gyldighetsperiode" }),
    ).toBeVisible({
      visible: Boolean(concept.gyldigFom || concept.gyldigTom),
    });
    await expect(
      this.page.getByText(
        formatISO(new Date(concept.gyldigFom as string).toISOString(), {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? "",
      ),
    ).toBeVisible({ visible: Boolean(concept.gyldigFom) });

    await expect(
      this.page.getByRole("heading", { name: "Gyldighetsperiode" }),
    ).toBeVisible({
      visible: Boolean(concept.gyldigFom || concept.gyldigTom),
    });
    await expect(
      this.page.getByText(
        formatISO(new Date(concept.gyldigTom as string).toISOString(), {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? "",
      ),
    ).toBeVisible({ visible: Boolean(concept.gyldigTom) });

    const { users } = await getUsers(apiRequestContext);
    await expect(
      this.page.getByRole("heading", { name: "Tildelt" }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        users.find((u) => u.id === concept.assignedUser)?.name as string,
      ),
    ).toBeVisible();

    const dateUpdatedHeading = this.page.getByRole("heading", {
      name: "Dato sist oppdatert",
    });
    await expect(dateUpdatedHeading).toBeVisible();
    const dateUpdatedContainer = this.page
      .locator("div")
      .filter({ has: dateUpdatedHeading })
      .last();
    await expect(
      dateUpdatedContainer.getByText(
        formatISO(new Date().toISOString(), {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? "",
      ),
    ).toBeVisible();

    const createdHeading = this.page.getByRole("heading", {
      name: "Opprettet",
      exact: true,
    });
    await expect(createdHeading).toBeVisible();
    const createdContainer = this.page
      .locator("div")
      .filter({ has: createdHeading })
      .last();
    await expect(
      createdContainer.getByText(
        formatISO(new Date().toISOString(), {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) ?? "",
      ),
    ).toBeVisible();

    const createdByHeading = this.page.getByRole("heading", {
      name: "Opprettet av",
      exact: true,
    });
    await expect(createdByHeading).toBeVisible();
    const createdByContainer = this.page
      .locator("div")
      .filter({ has: createdByHeading })
      .last();
    await expect(createdByContainer.getByText("LAMA LEDENDE")).toBeVisible();

    if (concept.kontaktpunkt?.harEpost || concept.kontaktpunkt?.harTelefon) {
      const contactHeading = this.page.getByRole("heading", {
        name: "Kontaktinformasjon for eksterne",
      });
      await expect(contactHeading).toBeVisible();
      const contactContainer = this.page
        .locator("div")
        .filter({ has: contactHeading })
        .last();
      await expect(
        contactContainer.getByText(concept.kontaktpunkt.harEpost as string),
      ).toBeVisible({
        visible: Boolean(concept.kontaktpunkt.harEpost),
      });
      await expect(
        contactContainer.getByText(concept.kontaktpunkt.harTelefon as string),
      ).toBeVisible({
        visible: Boolean(concept.kontaktpunkt.harTelefon),
      });
    }
    console.log("[DETAIL PAGE] Right column content checked.");
  }

  public async expectDetails(
    concept: Concept,
    apiRequestContext: APIRequestContext,
  ) {
    console.log(
      "[DETAIL PAGE] Checking all details for concept:",
      concept.anbefaltTerm?.navn.nb,
    );
    await this.expectHeading(concept);
    await this.expectActionButtons();
    await this.expectLanguageCombobox();
    await this.expectLeftColumnContent(concept, apiRequestContext);
    await this.expectRightColumnContent(concept, apiRequestContext);
    await this.expectCommentsTab();
    await this.expectHistoryTab();
    await this.expectVersionTab(concept);
    console.log(
      "[DETAIL PAGE] All details checked for concept:",
      concept.anbefaltTerm?.navn.nb,
    );
  }
}
