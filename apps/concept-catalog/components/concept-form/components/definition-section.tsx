import { Concept, Definisjon, ISOLanguage } from '@catalog-frontend/types';
import {
  Box,
  Button,
  Card,
  ErrorMessage,
  Fieldset,
  Heading,
  Paragraph,
  Popover,
  Tag,
} from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { PencilWritingIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { DefinitionModal } from './definition-modal';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { TitleWithTag } from '@catalog-frontend/ui';
import { HelpMarkdown } from './help-markdown';

export const DefinitionSection = () => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const definitions = ['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'];
  const allowedLanguages = Object.freeze<ISOLanguage[]>(['nb', 'nn', 'en']);

  return (
    <Box>
      <Box className={styles.fieldSet}>
        <Fieldset
          legend={
            <TitleWithTag
              title={
                <>
                  Definisjon
                  <HelpMarkdown
                    title={'Hjelpetekst definisjon'}
                    type='button'
                    size='sm'
                    placement='right-end'
                  >
                    {localization.conceptForm.helpText.definition}
                  </HelpMarkdown>
                </>
              }
              tagTitle={localization.tag.required}
            />
          }
        >
          {Object.keys(errors).some((value) =>
            ['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'].includes(value),
          ) && (
            <ErrorMessage>Minst en definisjon må være definert!</ErrorMessage>
          )}
        </Fieldset>

        {definitions
          .filter((name) => values[name])
          .map((name, index) => {
            const def: Definisjon = values[name];
            return (
              def && (
                <Card
                  key={name}
                  color='neutral'
                >
                  <Card.Header className={styles.definitionHeader}>
                    <div>
                      <Heading
                        level={3}
                        size='xxsmall'
                      >
                        {localization.conceptForm.fieldLabel.definitionTargetGroupFull[name]}
                      </Heading>
                      <Popover
                        open={open[index]}
                        onClose={() => setOpen({...open, [index]: false})}
                        placement='top'
                        size='md'
                        variant='default'
                      >
                        <Popover.Trigger asChild>
                          <Tag
                            size='sm'
                            color='second'
                            onMouseEnter={() => def.kildebeskrivelse?.kilde?.length && setOpen({...open, [index]: true})}
                            onMouseOut={() => setOpen({...open, [index]: false})}
                          >
                            {`${def.kildebeskrivelse?.kilde?.length ? def.kildebeskrivelse?.kilde.length : 'Ingen'} ${localization.conceptForm.fieldLabel.sources.toLowerCase()}`}
                          </Tag>
                        </Popover.Trigger>
                        <Popover.Content>
                          <ul>
                            {def.kildebeskrivelse?.kilde.map((source, index) => (
                              <li key={index}>{source.tekst || source.uri}</li>
                            ))}
                          </ul>
                        </Popover.Content>
                      </Popover>
                    </div>
                    <div>
                      <DefinitionModal
                        initialDefinition={def}
                        header={localization.conceptForm.fieldLabel.definitionTargetGroupFull[name] as string}
                        trigger={
                          <Button
                            variant='tertiary'
                            size='sm'
                          >
                            <PencilWritingIcon
                              title='Rediger'
                              fontSize='1.5rem'
                            />
                            Rediger
                          </Button>
                        }
                        onSucces={(updatedDef) => setFieldValue(name, updatedDef)}
                      />

                      <Button
                        variant='tertiary'
                        size='sm'
                        color='danger'
                        onClick={() => setFieldValue(name, undefined)}
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
                    <Box>
                      {allowedLanguages
                        .filter((lang) => def.tekst[lang])
                        .map((lang) => (
                          <Tag
                            key={lang}
                            size='sm'
                            color='third'
                          >
                            {localization.language[lang]}
                          </Tag>
                        ))}
                    </Box>
                  </Card.Content>
                </Card>
              )
            );
          })}
      </Box>
      <Box className={styles.buttonRow}>
        {definitions
          .filter((name) => !values[name])
          .map((name) => (
            <DefinitionModal
              key={name}
              header={localization.conceptForm.fieldLabel.definitionTargetGroup[name]}
              trigger={
                <Button
                  variant='tertiary'
                  color='first'
                  size='sm'
                >
                  <PlusCircleIcon
                    aria-hidden
                    fontSize='1rem'
                  />
                  {localization.conceptForm.fieldLabel.definitionTargetGroup[name]}
                </Button>
              }
              onSucces={(def) => setFieldValue(name, def)}
            />
          ))}
      </Box>
    </Box>
  );
};
