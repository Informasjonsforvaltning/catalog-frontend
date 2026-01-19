import { RelationTypeEnum } from "@catalog-frontend/types";
import {
  compareVersion,
  localization,
  parseDateTime,
  versionToString,
} from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { nb } from "yup-locales";

Yup.setLocale(nb);

const getRevisions = async ({ baseUri, catalogId, conceptId }) => {
  const response = await fetch(
    `${baseUri}/api/catalogs/${catalogId}/concepts/${conceptId}/revisions`,
  );
  if (response.status !== 200) {
    return [];
  }
  return await response.json();
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const tekstMedSpraakKodeArray = (label: string) =>
  Yup.object()
    .nullable()
    .shape({
      nb: Yup.array()
        .of(Yup.string())
        .nullable()
        .label(`${label} (${localization.language.nb})`),
      nn: Yup.array()
        .of(Yup.string())
        .nullable()
        .label(`${label} (${localization.language.nn})`),
      en: Yup.array()
        .of(Yup.string())
        .nullable()
        .label(`${label} (${localization.language.en})`),
    });

const kilde = (required) =>
  Yup.array()
    .of(
      Yup.object().shape({
        tekst: Yup.string()
          .nullable()
          .test({
            test(value) {
              const isRequired = !this.parent.uri;

              if (isRequired && (!value || value.length < 3)) {
                return this.createError({
                  message: localization.formatString(
                    localization.conceptForm.validation.minLength,
                    3,
                  ) as string,
                });
              }
              return true;
            },
          }),
        uri: Yup.string()
          .nullable()
          .test({
            test(value) {
              const isRequired = !this.parent.tekst;

              if ((isRequired || value) && !isValidUrl(value)) {
                return this.createError({
                  message: localization.conceptForm.validation.invalidUrl,
                });
              }
              return true;
            },
          }),
      }),
    )
    .test({
      test(value) {
        const isRequired =
          required && this.parent.forholdTilKilde !== "egendefinert";

        if (isRequired && !value?.length) {
          return this.createError({
            message: localization.conceptForm.validation.minOneSource,
          });
        }
        return true;
      },
    })
    .nullable();

export const definitionSchema = (required) =>
  Yup.object()
    .shape({
      tekst: Yup.object().shape({
        nb: Yup.string().test({
          test() {
            const { nb, nn, en } = this.parent;
            if (!nb && !nn && !en) {
              return this.createError({
                message: localization.conceptForm.validation.required,
                path: this.path,
              });
            }
            return true;
          },
        }),
        nn: Yup.string().test({
          test() {
            const { nb, nn, en } = this.parent;
            if (!nb && !nn && !en) {
              return this.createError({
                message: localization.conceptForm.validation.required,
                path: this.path,
              });
            }
            return true;
          },
        }),
        en: Yup.string().test({
          test() {
            const { nb, nn, en } = this.parent;
            if (!nb && !nn && !en) {
              return this.createError({
                message: localization.conceptForm.validation.required,
                path: this.path,
              });
            }
            return true;
          },
        }),
      }),
      kildebeskrivelse: Yup.object()
        .shape({
          forholdTilKilde: Yup.string(),
          kilde: kilde(required),
        })
        .nullable(),
    })
    .test({
      test() {
        if (this.parent) {
          const {
            definisjon,
            definisjonForAllmennheten,
            definisjonForSpesialister,
          } = this.parent;
          if (
            required &&
            !(
              definisjon ||
              definisjonForAllmennheten ||
              definisjonForSpesialister
            )
          ) {
            return this.createError({
              message: localization.conceptForm.validation.required,
              path: this.path,
            });
          }
        }
        return true;
      },
    })
    .nullable()
    .default(null);

export const relationSchema = Yup.object().shape({
  relasjon: Yup.string()
    .required()
    .label(localization.conceptForm.fieldLabel.relation),
  relasjonsType: Yup.string().when("relasjon", (relasjon) => {
    if (
      `${relasjon}` === RelationTypeEnum.PARTITIV ||
      `${relasjon}` === RelationTypeEnum.GENERISK
    ) {
      return Yup.string()
        .required()
        .label(localization.conceptForm.fieldLabel.relationLevel);
    }
    return Yup.string()
      .nullable()
      .notRequired()
      .label(localization.conceptForm.fieldLabel.relationRole);
  }),
  relatertBegrep: Yup.string()
    .required()
    .label(localization.conceptForm.fieldLabel.relatedConcept),
});

const prefLabelNynorsk = Yup.string().label(
  `${localization.conceptForm.fieldLabel.prefLabel} (${localization.language.nn})`,
);

export const conceptSchema = ({ baseUri, required }) =>
  Yup.object().shape({
    anbefaltTerm: Yup.object().shape({
      navn: Yup.object().shape({
        nb: Yup.string()
          .required()
          .label(
            `${localization.conceptForm.fieldLabel.prefLabel} (${localization.language.nb})`,
          ),
        nn: required ? prefLabelNynorsk.required() : prefLabelNynorsk,
        en: Yup.string()
          .nullable()
          .label(
            `${localization.conceptForm.fieldLabel.prefLabel} (${localization.language.en})`,
          ),
      }),
    }),
    tillattTerm: tekstMedSpraakKodeArray(
      localization.conceptForm.fieldLabel.altLabel,
    ),
    frarådetTerm: tekstMedSpraakKodeArray(
      localization.conceptForm.fieldLabel.hiddenLabel,
    ),
    definisjon: definitionSchema(required),
    definisjonForAllmennheten: definitionSchema(required),
    definisjonForSpesialister: definitionSchema(required),
    fagområde: tekstMedSpraakKodeArray(
      localization.conceptForm.fieldLabel.subjectFree,
    ).test({
      test(value) {
        if (!isEmpty(value) && !isEmpty(this.parent.fagområdeKoder)) {
          return this.createError({
            message: localization.conceptForm.validation.subjectConflict,
            path: this.path,
          });
        }
        return true;
      },
    }),
    fagområdeKoder: Yup.array()
      .nullable()
      .label(localization.conceptForm.fieldLabel.subjectCodeList)
      .test({
        test(value) {
          if (!isEmpty(value) && !isEmpty(this.parent.fagområde)) {
            return this.createError({
              message: localization.conceptForm.validation.subjectConflict,
              path: this.path,
            });
          }
          return true;
        },
      }),
    statusURI: Yup.string()
      .nullable()
      .label(localization.conceptForm.fieldLabel.status),
    omfang: Yup.object()
      .nullable()
      .shape({
        tekst: Yup.string()
          .nullable()
          .label(localization.conceptForm.fieldLabel.valueRangeDescription),
        uri: Yup.string()
          .nullable()
          .test({
            test(value) {
              if (value && !isValidUrl(value)) {
                return this.createError({
                  message: localization.conceptForm.validation.invalidUrl,
                });
              }
              return true;
            },
          }),
      }),
    kontaktpunkt: Yup.object()
      .test(
        "contact-test",
        "Minst en av kontaktfeltene må fylles ut.",
        (value: any) => {
          if (!required) return true;
          return value !== null && (value.harEpost || value.harTelefon);
        },
      )
      .shape({
        harEpost: Yup.string()
          .nullable()
          .email(localization.conceptForm.validation.email)
          .label(localization.conceptForm.fieldLabel.emailAddress),
        harTelefon: Yup.string()
          .nullable()
          .matches(/^\+?(?:[0-9\s]){6,14}[0-9]$/i, {
            message: localization.conceptForm.validation.phone,
            excludeEmptyString: true,
          })
          .label(localization.conceptForm.fieldLabel.phoneNumber),
      })
      .nullable(),
    gyldigFom: Yup.mixed()
      .nullable()
      .test({
        test(value) {
          if (!value) {
            return true;
          }

          const fomDateTime = parseDateTime(value);
          if (fomDateTime?.isValid) {
            return true;
          }

          return this.createError({
            message: localization.conceptForm.validation.date,
            path: this.path,
          });
        },
      }),
    gyldigTom: Yup.mixed()
      .nullable()
      .test({
        test(value) {
          if (!value) {
            return true;
          }

          const tomDateTime = parseDateTime(value);
          if (tomDateTime?.isValid) {
            if (this.parent.gyldigFom === null) {
              return true;
            }
            const fomDateTime = parseDateTime(this.parent.gyldigFom);
            if (
              fomDateTime &&
              tomDateTime.toJSDate() >= fomDateTime?.toJSDate()
            ) {
              return true;
            }
          }

          return this.createError({
            message: localization.conceptForm.validation.date,
            path: this.path,
          });
        },
      }),
    internSeOgså: Yup.array().of(Yup.string()).nullable(),
    internErstattesAv: Yup.array().of(Yup.string()).nullable(),
    internBegrepsRelation: Yup.array().of(relationSchema).nullable(),
    seOgså: Yup.array().of(Yup.string()).nullable(),
    erstattesAv: Yup.array().of(Yup.string()).nullable(),
    begrepsRelation: Yup.array().of(relationSchema).nullable(),
    versjonsnr: Yup.object()
      .test({
        async test(value) {
          if (required) {
            if (this.parent.id) {
              const revisions = (
                await getRevisions({
                  baseUri,
                  catalogId: this.parent.ansvarligVirksomhet.id,
                  conceptId: this.parent.id,
                })
              )
                .filter((rev) => rev.id !== this.parent.id)
                .sort((a, b) => -compareVersion(a.versjonsnr, b.versjonsnr));
              if (compareVersion(revisions[0]?.versjonsnr, value as any) >= 0) {
                return this.createError({
                  message: localization.formatString(
                    localization.conceptForm.validation.version,
                    {
                      min: versionToString(revisions[0]?.versjonsnr),
                    },
                  ) as string,
                });
              }
            }

            if (
              compareVersion({ major: 0, minor: 1, patch: 0 }, value as any) > 0
            ) {
              return this.createError({
                message: localization.formatString(
                  localization.conceptForm.validation.version,
                  {
                    min: "0.1.0",
                  },
                ) as string,
              });
            }
          }

          return true;
        },
      })
      .shape({
        major: Yup.number(),
        minor: Yup.number(),
        patch: Yup.number(),
      }),
  });
