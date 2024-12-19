'use client';

import React from 'react';
import { FastField, FormikErrors, useFormikContext } from 'formik';
import {
  Box,
  Checkbox,
  Combobox,
  HelpText,
  Label,
  Paragraph,
  Textarea,
  Textfield,
} from '@digdir/designsystemet-react';
import { AssignedUser, CodeList, Concept, InternalField } from '@catalog-frontend/types';
import { capitalizeFirstLetter, getTranslateText } from '@catalog-frontend/utils';
import { TitleWithTag } from '@catalog-frontend/ui';
import styles from '../../concept-form.module.scss';
import { getParentPath } from '../../../../utils/codeList';

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
}: {
  values: Concept;
  setFieldValue: (field: string, value: any, validate?: boolean) => Promise<void | FormikErrors<Concept>>;
  internalField: InternalField;
  userList: AssignedUser[];
  codeLists: CodeList[];
}) => {
  const FieldLabel = () => (
    <TitleWithTag
      title={
        <>
          <Label size='sm'>{capitalizeFirstLetter(getTranslateText(internalField.label) as string)}</Label>
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
  const fieldValue = values.interneFelt?.[internalField.id]?.value;

  if (internalField.type === 'text_short') {
    return (
      <FastField
        name={name}
        size='sm'
        label={<FieldLabel />}
        as={Textfield}
      />
    );
  }

  if (internalField.type === 'text_long') {
    return (
      <FastField
        name={name}
        size='sm'
        as={Textarea}
        label={<FieldLabel />}
        rows={3}
      />
    );
  }

  if (internalField.type === 'boolean') {
    return (
      <Checkbox.Group
        legend={<FieldLabel />}
        size='sm'
      >
        <Checkbox
          value={internalField.id}
          checked={fieldValue === 'true'}
          onChange={(e) => setFieldValue(name, e.target.checked ? 'true' : 'false')}
        />
      </Checkbox.Group>
    );
  }

  if (internalField.type === 'user_list') {
    return (
      <Combobox
        label={<FieldLabel />}
        size='sm'
        placeholder={'select user'}
        value={fieldValue && userList?.find((u) => u.id === fieldValue) ? [fieldValue] : []}
        onValueChange={(value) => setFieldValue(name, value[0])}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {userList.map(({ id, name: userName }) => (
          <Combobox.Option
            key={id ?? ''}
            value={id ?? ''}
          >
            {userName}
          </Combobox.Option>
        ))}
      </Combobox>
    );
  }

  if (internalField.type === 'code_list') {
    const codes = codeLists.find((list) => list.id === internalField.codeListId)?.codes;

    return (
      <Combobox
        label={<FieldLabel />}
        size='sm'
        value={fieldValue && codes?.find((code) => code.id === fieldValue) ? [fieldValue] : []}
        onValueChange={(value) => setFieldValue(name, value[0])}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {codes?.map((code) => {
          const parentPath = getParentPath(code, codes);
          return (
            <Combobox.Option
              key={code.id}
              value={code.id}
              description={parentPath.length > 0 ? `Overordnet: ${parentPath.join(' - ')}` : ''}
            >
              {getTranslateText(code.name)}
            </Combobox.Option>
          );
        })}
      </Combobox>
    );
  }

  return null;
};

export const InternalSection = ({ internalFields, userList, codeLists }: InternalSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

  return (
    <Box className={styles.internalSection}>
      <Combobox
        label={
          <TitleWithTag
            title={
              <>
                <Label size='sm'>Hvem skal begrepet tildeles?</Label>
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
        size='sm'
        value={
          values.assignedUser && userList?.find((user) => user.id === values.assignedUser) ? [values.assignedUser] : []
        }
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

      <FastField
        as={Textfield}
        label={
          <TitleWithTag
            title={
              <>
                <Label size='sm'>Forkortelse</Label>
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
        name='abbreviatedLabel'
        error={errors?.['abbreviatedLabel']}
      />
      {internalFields?.map((internalField) => (
        <div key={internalField.id}>
          {renderInternalField({ internalField, values, setFieldValue, userList, codeLists })}
        </div>
      ))}
    </Box>
  );
};
