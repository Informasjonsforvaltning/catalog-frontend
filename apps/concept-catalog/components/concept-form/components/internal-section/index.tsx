'use client';

import React, {  } from 'react';
import { FastField, useFormikContext } from 'formik';
import {
  Box,
  Checkbox,
  Combobox,
  Fieldset,
  HelpText,
  Paragraph,
  Textarea,
  Textfield,
} from '@digdir/designsystemet-react';
import { AssignedUser, CodeList, Concept, InternalField } from '@catalog-frontend/types';
import { capitalizeFirstLetter, getTranslateText } from '@catalog-frontend/utils';
import { FieldsetDivider, TitleWithTag } from '@catalog-frontend/ui';

export type InternalSectionProps = {
  internalFields: InternalField[];
  userList: AssignedUser[];
  codeLists: CodeList[];
};

const renderInternalField = ({
  values,
  setFieldValue,
  internalField,  
  userList,
  codeLists,
}) => {
  const Legend = () => (
    <TitleWithTag
      title={
        <>
          {capitalizeFirstLetter(getTranslateText(internalField.label) as string)}
          {getTranslateText(internalField.description) && (
            <HelpText
              title={getTranslateText(internalField.label) as string}
              type='button'
              size='sm'
            >
              <Paragraph size='sm'>{getTranslateText(internalField.description)}</Paragraph>
            </HelpText>
          )}
        </>
      }
    />
  );

  const name = `interneFelt[${internalField.id}].value`;

  if (internalField.type === 'text_short') {
    return (
      <Fieldset
        legend={<Legend />}
        size='sm'
      >
        <FastField
          name={name}
          as={Textfield}
        />
      </Fieldset>
    );
  }

  if (internalField.type === 'text_long') {
    return (
      <Fieldset
        legend={<Legend />}
        size='sm'
      >
        <FastField
          name={name}
          as={Textarea}
          rows={3}
        />
      </Fieldset>
    );
  }

  if (internalField.type === 'boolean') {
    return (
      <Fieldset
        legend={<Legend />}
        size='sm'
      >
        <FastField
          name={name}
          as={Checkbox}
        />
      </Fieldset>
    );
  }

  if (internalField.type === 'user_list') {
    return (
      <Fieldset
        legend={<Legend />}
        size='sm'
      >
        <FastField
          name={name}
          as={Combobox}
          placeholder={'select user'}
        >
          {userList.map(({ id, name: userName }) => (
            <Combobox.Option
              key={id ?? ''}
              value={id ?? ''}
            >
              {userName}
            </Combobox.Option>
          ))}
        </FastField>
      </Fieldset>
    );
  }

  //   if (internalField.type === 'code_list') {
  //     const codeListNodes = convertCodeListToTreeNodes(
  //       codeLists?.filter(
  //         codeList => codeList.id === internalField.codeListId
  //       )?.[0]
  //     );

  //     return (
  //       <>
  //         <Help />
  //         <Field
  //           name={name}
  //           component={CheckboxTreeField}
  //           nodes={codeListNodes}
  //         />
  //       </>
  //     );
  //   }

  return null;
};

export const InternalSection = ({ internalFields, userList, codeLists }: InternalSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

  return (
    <Box>
      <Fieldset
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                Hvem skal begrepet tildeles?
                <HelpText
                  title={''}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>Velg personen som skal ha ansvaret for å følge opp begrepet.</Paragraph>
                </HelpText>
              </>
            }
          />
        }
      >
        <Combobox
          size='sm'
          value={values.assignedUser ? [values.assignedUser] : []}
          onValueChange={(val) => setFieldValue('assignedUser', val[0])}
        >
          <Combobox.Empty>Fant ingen treff</Combobox.Empty>
          {userList?.map((user) => {
            return (
              <Combobox.Option
                key={user.id}
                value={user.id ?? ''}
              >
                {user.name}
              </Combobox.Option>
            );
          })}
        </Combobox>
      </Fieldset>
      <FieldsetDivider />
      <Fieldset
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                Forkortelse
                <HelpText
                  title={'Hjelpetekst forkortelse'}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    En forkortelse er en kortform av et ord eller en uttrykk, laget ved å fjerne noen av bokstavene for
                    å gjøre det enklere og raskere å skrive. Forkortelser brukes ofte for å gjøre teksten kortere og mer
                    oversiktlig.
                  </Paragraph>
                </HelpText>
              </>
            }
          />
        }
      >
        <FastField
          as={Textfield}
          name='abbreviatedLabel'
          error={errors?.['abbreviatedLabel']}
        />
      </Fieldset>
      {internalFields?.map((internalField) => (
        <div key={internalField.id}>
          <FieldsetDivider />
          {renderInternalField({internalField, values, setFieldValue, userList, codeLists})}
        </div>
      ))}
    </Box>
  );
};