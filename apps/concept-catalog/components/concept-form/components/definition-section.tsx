import { Concept, Definisjon, ISOLanguage, Kilde, StorageData } from '@catalog-frontend/types';
import {
  Button,
  Card,
  ErrorMessage,
  Fieldset,
  Heading,
  Paragraph,
  Popover,
  Tag,
} from '@digdir/designsystemet-react';
import { FormikErrors, useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { PencilWritingIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { forwardRef, useState } from 'react';
import { DefinitionModal } from './definition-modal';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { DataStorage } from '@catalog-frontend/utils';

function getFirstErrorByRootKeys(obj: FormikErrors<Concept>, rootKeys: string[]): string | null {
  for (const rootKey of rootKeys) {
    if (Object.prototype.hasOwnProperty.call(obj, rootKey)) {
      const value = obj[rootKey];
      if (typeof value === 'string') {
        return value;
      } else if (typeof value === 'object') {
        // Recursively search within the nested object
        for (const nestedKey in value) {
          const nestedValue = getFirstErrorByRootKeys(value, [nestedKey]);
          if (nestedValue) {
            return nestedValue;
          }
        }
      }
    }
  }

  // If none of the root keys are directly found, check nested objects
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      const nestedValue = getFirstErrorByRootKeys(value, rootKeys);
      if (nestedValue) {
        return nestedValue;
      }
    }
  }

  return null;
}

type DefinitionSectionProps = {
  changed?: string[];
  readOnly?: boolean;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

export const DefinitionSection = ({ changed, readOnly, autoSaveId, autoSaveStorage }: DefinitionSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const definitions = ['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'] as const;
  const allowedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];

  const handleChangeDefinitionInModal = (def: Definisjon, fieldName: string) => {
    if (autoSaveStorage) {
      autoSaveStorage?.setSecondary('definition', {
        id: autoSaveId,
        values: {
          definition: def,
          fieldName
        },
        lastChanged: new Date().toISOString(),
      });
    }
  };

  const handleCloseDefinitionModal = () => {
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary('definition');
    }
  };

  const handleUpdateDefinition = (def: Definisjon | null, fieldName: string) => {
    setFieldValue(fieldName, def);
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary('definition');
    }
  };

  const prepareInitialValues = (def: Definisjon): Definisjon => {
    return {
      ...def,
      kildebeskrivelse: {
        forholdTilKilde: def.kildebeskrivelse?.forholdTilKilde ?? 'egendefinert',
        kilde: def.kildebeskrivelse?.kilde ?? [],
      },
    };
  };

  const sourcesText = (sources: Kilde[] | undefined) => {
    if (!sources?.length) {
      return `${localization.none} ${localization.conceptForm.fieldLabel.sources.toLowerCase()}`;
    } else if (sources.length === 1) {
      return `1 ${localization.conceptForm.fieldLabel.source.toLowerCase()}`;
    } else {
      return `${sources.length} ${localization.conceptForm.fieldLabel.sources.toLowerCase()}`;
    }
  };

  const ForwardedTag = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    return (
      <button
        className={styles.forwardedTag}
        {...props}
        ref={ref}
      />
    );
  });

  ForwardedTag.displayName = 'ForwardedTag';

  return (
    <Card>
      <Card className={styles.fieldSet}>
        <Fieldset
          readOnly={readOnly}
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.definition}
              tagTitle={localization.tag.required}
              changed={definitions.some((def) => changed?.includes(def))}
            >
              Definisjon
            </TitleWithHelpTextAndTag>
          }
        />

        {definitions
          .filter((name) => values[name])
          .map((name, index) => {
            const def: Definisjon | undefined = values[name];
            return (
              def && (
                <Card
                  key={name}
                  color='neutral'
                  className={Object.keys(errors).includes(name) ? styles.borderDanger : ''}
                >
                  <Card.Header className={styles.definitionHeader}>
                    <div>
                      <Heading
                        level={3}
                        size='xxsmall'
                      >
                        {localization.conceptForm.fieldLabel.definitionTargetGroupFull[name]}
                      </Heading>
                      {def.kildebeskrivelse?.kilde?.length ? (
                        <Popover
                          open={open[index]}
                          onClose={() => setOpen({ ...open, [index]: false })}
                          placement='top'
                          size='md'
                          variant='default'
                        >
                          <Popover.Trigger asChild>
                            <ForwardedTag
                              role='button'
                              onMouseEnter={() =>
                                def.kildebeskrivelse?.kilde?.length && setOpen({ ...open, [index]: true })
                              }
                              onMouseOut={() => setOpen({ ...open, [index]: false })}
                            >
                              {sourcesText(def.kildebeskrivelse?.kilde)}
                            </ForwardedTag>
                          </Popover.Trigger>
                          <Popover.Content>
                            <ul>
                              {def.kildebeskrivelse?.kilde?.map((source, index) => (
                                <li key={index}>{source.tekst || source.uri}</li>
                              ))}
                            </ul>
                          </Popover.Content>
                        </Popover>
                      ) : (
                        <Tag
                          data-size='sm'
                          color='second'
                        >
                          {sourcesText(def.kildebeskrivelse?.kilde)}
                        </Tag>
                      )}
                    </div>
                    <div>
                      <DefinitionModal
                        initialDefinition={def ? prepareInitialValues(def) : undefined}
                        header={localization.conceptForm.fieldLabel.definitionTargetGroupFull[name] as string}
                        definitionHelpText={localization.conceptForm.helpText.definitionText[name] as string}
                        trigger={
                          <Button
                            variant='tertiary'
                            data-size='sm'
                            disabled={readOnly}
                          >
                            <PencilWritingIcon
                              title='Rediger'
                              fontSize='1.5rem'
                            />
                            Rediger
                          </Button>
                        }
                        onSucces={(updatedDef) => handleUpdateDefinition(updatedDef, name)}
                        onChange={(updatedDef) => handleChangeDefinitionInModal(updatedDef, name)}
                        onClose={handleCloseDefinitionModal}
                      />

                      <Button
                        variant='tertiary'
                        data-size='sm'
                        color='danger'
                        disabled={readOnly}
                        onClick={() => handleUpdateDefinition(null, name)}
                      >
                        <TrashIcon
                          title='Slett'
                          fontSize='1.5rem'
                        />
                        Slett
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Content className={styles.definitionContent}>
                    <Paragraph>{getTranslateText(def.tekst)}</Paragraph>
                    <Card>
                      {allowedLanguages
                        .filter((lang) => def.tekst[lang])
                        .map((lang) => (
                          <Tag
                            key={lang}
                            data-size='sm'
                            color='third'
                          >
                            {localization.language[lang]}
                          </Tag>
                        ))}
                    </Card>
                  </Card.Content>
                </Card>
              )
            );
          })}
      </Card>
      {!readOnly && (
        <Card className={styles.buttonRow}>
          {definitions
            .filter((name) => !values[name])
            .map((name) => (
              <DefinitionModal
                key={name}
                header={localization.conceptForm.fieldLabel.definitionTargetGroup[name]}
                definitionHelpText={localization.conceptForm.helpText.definitionText[name]}
                trigger={
                  <Button
                    variant='tertiary'
                    color='first'
                    data-size='sm'
                  >
                    <PlusCircleIcon
                      aria-hidden
                      fontSize='1rem'
                    />
                    {localization.conceptForm.fieldLabel.definitionTargetGroup[name]}
                  </Button>
                }
                onSucces={(def) => handleUpdateDefinition(def, name)}
                onChange={(def) => handleChangeDefinitionInModal(def, name)}
                onClose={handleCloseDefinitionModal}
              />
            ))}
        </Card>
      )}

      {Object.keys(errors).some((value) =>
        ['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'].includes(value),
      ) && (
          <ErrorMessage>
            {getFirstErrorByRootKeys(errors, ['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'])}
          </ErrorMessage>
        )}
    </Card>
  );
};
