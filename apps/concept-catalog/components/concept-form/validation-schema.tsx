import { ContactDetails, RelationTypeEnum } from '@catalog-frontend/types';
import { compareVersion, localization } from '@catalog-frontend/utils';
import { DateTime } from 'luxon';
import * as Yup from 'yup';

const getRevisions = async ({ catalogId, conceptId }) => {
  const response = await fetch(`/api/catalogs/${catalogId}/concepts/${conceptId}/revisions`);
  if (response.status !== 200) {
    return [];
  }
  return await response.json();
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const tekstMedSpraakKodeArray = Yup.object()
  .nullable()
  .shape({
    nb: Yup.array().of(Yup.string()).nullable(),
    nn: Yup.array().of(Yup.string()).nullable(),
    en: Yup.array().of(Yup.string()).nullable(),
  });

const kilde = Yup.array()
  .of(
    Yup.object().shape({
      tekst: Yup.string()
        .nullable()
        .test({
          test(value) {
            const isRequired = this.parent.forholdTilKilde !== 'egendefinert';

            if (isRequired && (!value || value.length < 3)) {
              return this.createError({
                message: localization.formatString(localization.conceptForm.validation.minLength, {
                  length: '3',
                }) as string,
              });
            }
            return true;
          },
        }),
      uri: Yup.string()
        .nullable()
        .test({
          test(value) {
            const isRequired = this.parent.forholdTilKilde !== 'egendefinert';

            if (isRequired && !isValidUrl(value)) {
              return this.createError({
                message: localization.conceptForm.validation.invalidUrl,
              });
            }
            return true;
          },
        }),
    }),
  )
  .nullable();

export const definitionSchema = Yup.object()
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
    kildebeskrivelse: Yup.object().nullable().shape({
      forholdTilKilde: Yup.string().nullable(),
      kilde,
    }),
  })
  .test({
    test() {
      if (this.parent) {
        const { definisjon, definisjonForAllmennheten, definisjonForSpesialister } = this.parent;
        if (!(definisjon || definisjonForAllmennheten || definisjonForSpesialister)) {
          return this.createError({
            message: localization.conceptForm.validation.required,
            path: this.path,
          });
        }
      }
      return true;
    },
  }).nullable();

export const relationSchema = Yup.object().shape({
    relasjon: Yup.string().required('Feltet må fylles ut'),
    relasjonsType: Yup.string()
      .nullable()
      .when('relasjon', (relasjon) => {
        if (`${relasjon}` === RelationTypeEnum.PARTITIV || `${relasjon}` === RelationTypeEnum.GENERISK) {
          return Yup.string().required();
        }
        return Yup.string().notRequired();
      }),
    relatertBegrep: Yup.string().required(),
  });  

export const conceptSchema = Yup.object().shape({
  anbefaltTerm: Yup.object().shape({
    navn: Yup.object().shape({
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
  }),
  tillattTerm: tekstMedSpraakKodeArray,
  frarådetTerm: tekstMedSpraakKodeArray,
  definisjon: definitionSchema,
  definisjonForAllmennheten: definitionSchema,
  definisjonForSpesialister: definitionSchema,
  fagområde: tekstMedSpraakKodeArray,
  statusURI: Yup.string().nullable(),
  omfang: Yup.object()
    .nullable()
    .shape({
      tekst: Yup.string().nullable(),
      uri: Yup.string().nullable().url(localization.conceptForm.validation.url),
    }),
  kontaktpunkt: Yup.object()
  .test(
    'contact-test',
    'Minst en av kontaktfeltene må fylles ut.',
    (value: any) => {
      return value.harEpost || value.harTelefon;
    })  
  .shape({
      harEpost: Yup.string().nullable().email(localization.conceptForm.validation.email),
      harTelefon: Yup.string()
        .nullable()
        .matches(/^\+?(?:[0-9\s]){6,14}[0-9]$/i, {
          message: localization.conceptForm.validation.phone,
          excludeEmptyString: true,
        }),
    }),
  gyldigFom: Yup.mixed()
    .nullable()
    .test({
      test(value) {
        if (value == null || DateTime.fromJSDate(value).isValid || DateTime.fromFormat(value, 'yyyy-MM-dd').isValid) {
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
        if (value == null || DateTime.fromJSDate(value).isValid || DateTime.fromFormat(value, 'yyyy-MM-dd').isValid) {
          return true;
        }
        return this.createError({
          message: localization.conceptForm.validation.date,
          path: this.path,
        });
      },
    }),
  internSeOgså: Yup.array().of(Yup.string()).nullable(),
  internErstattesAv: Yup.array().of(Yup.string()).nullable(),
  internBegrepsRelation: Yup.array()
    .of(relationSchema)
    .nullable(),
  seOgså: Yup.array().of(Yup.string()).nullable(),
  erstattesAv: Yup.array().of(Yup.string()).nullable(),
  begrepsRelation: Yup.array()
    .of(relationSchema)
    .nullable(),
  versjonsnr: Yup.object()
    .test(
      'version-check',
      'Version must be minimum 0.1.0 and greater than latest published version',
      (value, context) =>
        context.parent.id
          ? getRevisions({ catalogId: context.parent.ansvarligVirksomhet.id, conceptId: context.parent.id })
              .then((revisions) => {
                // TODO check if erSistPublisert fremdeles finnes på revision
                const latestPublishedRevision = revisions.find((rev) => rev.erSistPublisert);
                return (
                  compareVersion(
                    latestPublishedRevision?.id !== context.parent.id ? latestPublishedRevision?.versjonsnr : null,
                    value as any,
                  ) < 0
                );
              })
              .catch(() => false)
          : compareVersion({ major: 0, minor: 1, patch: 0 }, value as any) <= 0,
    )
    .shape({
      major: Yup.number(),
      minor: Yup.number(),
      patch: Yup.number(),
    }),
});
