'use client';

import React from 'react';
import { FastField, FormikErrors, useFormikContext } from 'formik';
import { Combobox, Textarea, Textfield } from '@digdir/designsystemet-react';
import { CheckboxGroup } from '@fellesdatakatalog/ui';
import { AssignedUser, CodeList, Concept, InternalField } from '@catalog-frontend/types';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { FormikMultivalueTextfield, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import styles from '../../concept-form.module.scss';
import { getParentPath } from '../../../../utils/codeList';

export type InternalSectionProps = {
  internalFields: InternalField[];
  userList: AssignedUser[];
  codeLists: CodeList[];
  readOnly?: boolean;
  changed?: string[];
};

export const InternalSection = ({
  internalFields,
  userList,
  codeLists,
  readOnly = false,
  changed,
}: InternalSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

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
    const name = `interneFelt[${internalField.id}].value`;
    const fieldValue = values.interneFelt?.[internalField.id]?.value;

    const FieldLabel = () => (
      <TitleWithHelpTextAndTag
        helpText={getTranslateText(internalField.description) as string}
        changed={changed?.includes(name)}
      >
        {capitalizeFirstLetter(getTranslateText(internalField.label) as string)}
      </TitleWithHelpTextAndTag>
    );

    if (internalField.type === 'text_short') {
      return (
        <FastField
          name={name}
          data-size='sm'
          label={<FieldLabel />}
          as={Textfield}
          readOnly={readOnly}
        />
      );
    }

    if (internalField.type === 'text_long') {
      return (
        <FastField
          name={name}
          data-size='sm'
          as={Textarea}
          label={<FieldLabel />}
          rows={3}
          readOnly={readOnly}
        />
      );
    }

    if (internalField.type === 'boolean') {
      return (
        <CheckboxGroup
          legend={<FieldLabel />}
          data-size='sm'
          readOnly={readOnly}
          value={fieldValue === 'true' ? [internalField.id] : []}
          onChange={(values) => setFieldValue(name, values.includes(internalField.id) ? 'true' : 'false')}
          options={[{ value: internalField.id, label: '' }]}
        />
      );
    }

    if (internalField.type === 'user_list') {
      return (
        <Combobox
          label={<FieldLabel />}
          data-size='sm'
          placeholder={'select user'}
          value={fieldValue && userList?.find((u) => u.id === fieldValue) ? [fieldValue] : []}
          onValueChange={(value) => setFieldValue(name, value[0])}
          readOnly={readOnly}
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
          data-size='sm'
          value={fieldValue && codes?.find((code) => code.id === fieldValue) ? [fieldValue] : []}
          onValueChange={(value) => setFieldValue(name, value[0])}
          readOnly={readOnly}
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

  return (
    <div className={styles.internalSection}>
      <Combobox
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.assignedUser}
            changed={changed?.includes('assignedUser')}
          >
            {localization.conceptForm.fieldLabel.assignedUser}
          </TitleWithHelpTextAndTag>
        }
        data-size='sm'
        value={
          values.assignedUser && userList?.find((user) => user.id === values.assignedUser) ? [values.assignedUser] : []
        }
        onValueChange={(val) => setFieldValue('assignedUser', val[0])}
        readOnly={readOnly}
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
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.abbreviation}
            changed={changed?.includes('abbreviatedLabel')}
          >
            {localization.conceptForm.fieldLabel.abbreviationLabel}
          </TitleWithHelpTextAndTag>
        }
        data-size='sm'
        name='abbreviatedLabel'
        error={errors?.['abbreviatedLabel']}
        readOnly={readOnly}
      />

      <FormikMultivalueTextfield
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.labels}
            changed={changed?.includes('merkelapp')}
          >
            {localization.conceptForm.fieldLabel.labels}
          </TitleWithHelpTextAndTag>
        }
        name='merkelapp'
        error={errors?.['merkelapp']}
        readOnly={readOnly}
      />

      {internalFields?.map((internalField) => (
        <div key={internalField.id}>
          {renderInternalField({ internalField, values, setFieldValue, userList, codeLists })}
        </div>
      ))}
    </div>
  );
};
