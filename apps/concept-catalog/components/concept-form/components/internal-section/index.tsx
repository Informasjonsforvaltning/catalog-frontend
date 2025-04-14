'use client';

import React from 'react';
import { FastField, FormikErrors, useFormikContext } from 'formik';
import { Box, Checkbox, Combobox, Textarea, Textfield } from '@digdir/designsystemet-react';
import { AssignedUser, CodeList, Concept, InternalField } from '@catalog-frontend/types';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { FormikMultivalueTextfield, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import styles from '../../concept-form.module.scss';
import { getParentPath } from '../../../../utils/codeList';
import { get, isEmpty, isEqual } from 'lodash';

export type InternalSectionProps = {
  internalFields: InternalField[];
  userList: AssignedUser[];
  codeLists: CodeList[];
  readOnly?: boolean;
  markDirty?: boolean;
};

export const InternalSection = ({
  internalFields,
  userList,
  codeLists,
  readOnly = false,
  markDirty = false,
}: InternalSectionProps) => {
  const { errors, initialValues, values, setFieldValue } = useFormikContext<Concept>();

  const fieldIsChanged = (name: string) => {
    const a = get(initialValues, name);
    const b = get(values, name);
    if (isEmpty(a) && isEmpty(b)) {
      return false;
    }
    return markDirty && !isEqual(a, b);
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
    const name = `interneFelt[${internalField.id}].value`;
    const fieldValue = values.interneFelt?.[internalField.id]?.value;

    const FieldLabel = () => (
      <TitleWithHelpTextAndTag
        helpText={getTranslateText(internalField.description) as string}
        changed={fieldIsChanged(name)}
      >
        {capitalizeFirstLetter(getTranslateText(internalField.label) as string)}
      </TitleWithHelpTextAndTag>
    );

    if (internalField.type === 'text_short') {
      return (
        <FastField
          name={name}
          size='sm'
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
          size='sm'
          as={Textarea}
          label={<FieldLabel />}
          rows={3}
          readOnly={readOnly}
        />
      );
    }

    if (internalField.type === 'boolean') {
      return (
        <Checkbox.Group
          legend={<FieldLabel />}
          size='sm'
          readOnly={readOnly}
        >
          <Checkbox
            value={internalField.id}
            checked={fieldValue === 'true'}
            onChange={(e) => setFieldValue(name, e.target.checked ? 'true' : 'false')}
            aria-label={`${internalField.label}, ja eller nei`}
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
          size='sm'
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
    <Box className={styles.internalSection}>
      <Combobox
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.assignedUser}
            changed={fieldIsChanged('assignedUser')}
          >
            {localization.conceptForm.fieldLabel.assignedUser}
          </TitleWithHelpTextAndTag>
        }
        size='sm'
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
            changed={fieldIsChanged('abbreviatedLabel')}
          >
            {localization.conceptForm.fieldLabel.abbreviationLabel}
          </TitleWithHelpTextAndTag>
        }
        size='sm'
        name='abbreviatedLabel'
        error={errors?.['abbreviatedLabel']}
        readOnly={readOnly}
      />

      <FormikMultivalueTextfield
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.labels}
            changed={fieldIsChanged('merkelapp')}
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
    </Box>
  );
};
