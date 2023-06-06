import React from 'react';
import styles from './internal-fields.module.css';
import { Accordion, TextField } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';

import { Button, Select } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

import data from './mock-data.json';

import codelistOptions from './mock-codelist-options.json';

type FieldType = 'freetext' | 'boolean' | 'codelist';

interface SelectOption {
  label: string;
  value: FieldType;
}

interface InternalField {
  id?: string;
  name?: string;
  internalFieldType?: FieldType;
  codelistId?: string;
}

const fieldTypeOptions: { [key: string]: SelectOption } = {
  freetext: { label: 'Fritekst', value: 'freetext' },
  boolean: { label: 'Boolsk verdi', value: 'boolean' },
  codelist: { label: 'Kodeliste', value: 'codelist' },
};

export const InternalFieldsPage = () => {
  const [internalFieldsList, setInternalFieldList] = React.useState<InternalField[]>(data);

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, changeIndex) => {
    const nextFieldList = internalFieldsList.map((field, i) => {
      if (i == changeIndex) {
        return { ...field, name: event.target.value };
      } else {
        return field;
      }
    });

    setInternalFieldList(nextFieldList);
  };

  const fieldTypeChangeHandler = (value, changeIndex) => {
    const nextFieldList = internalFieldsList.map((field, i) => {
      if (i == changeIndex) {
        return { ...field, internalFieldType: value };
      } else {
        return field;
      }
    });
    setInternalFieldList(nextFieldList);
  };

  const codelistChangeHandler = (value, changeIndex) => {
    const nextFieldList = internalFieldsList.map((field, i) => {
      if (i == changeIndex) {
        return { ...field, codelistId: value };
      } else {
        return field;
      }
    });
    setInternalFieldList(nextFieldList);
  };

  const createFieldHandler = () => {
    setInternalFieldList([
      ...internalFieldsList,
      { id: Date.now().toString(), name: '', internalFieldType: 'freetext', codelistId: null },
    ]);
  };

  const deleteFieldHandler = (deleteIndex) => {
    if (window.confirm(localization.catalogAdmin.manage.confirmDelete)) {
      setInternalFieldList(internalFieldsList.filter((_, i) => i !== deleteIndex));
    }
  };

  const saveFieldHandler = (saveIndex) => {
    const fieldName = internalFieldsList[saveIndex]?.name;
    if (fieldName && validateNameField(fieldName)) {
      const field = internalFieldsList[saveIndex];
    } else {
      alert('Ugyldig felt.');
    }
  };

  const validateNameField = (name) => {
    /* - Match any letter (from any language)
       - Can contain numbers but not start with it.
       - Can contain space (but not start or end with it)
       - Must contain one or more characters
    */
    const regex = /^\p{L}[\p{L}\p{N}\p{P} ]*[^\s\p{Zs}]$|^\p{L}$/u;
    return regex.test(name);
  };

  return (
    <div className={styles.center}>
      <div className={styles.page}>
        <div className={styles.topButtonRow}>
          <Button
            className={styles.createButton}
            icon={<PlusCircleIcon title='' />}
            onClick={createFieldHandler}
          >
            {localization.catalogAdmin.create.newInternalField}
          </Button>
        </div>

        <div className={`${styles.row} ${styles.pb0_5}`}>
          <p>{localization.catalogAdmin.internalFields}</p>
        </div>
        <div className={styles.pageContent}>
          {internalFieldsList.map(({ id, name, internalFieldType, codelistId: selectedCodelist }, index) => (
            <Accordion
              key={id}
              border={true}
              className={styles.accordion}
            >
              <Accordion.Item>
                <Accordion.Header level={2}>
                  <h2 className={styles.label}>{name && name}</h2>
                  <p>{internalFieldType && fieldTypeOptions[internalFieldType].label}</p>
                </Accordion.Header>
                <Accordion.Content>
                  <div className={styles.accordionContent}>
                    <div className={styles.field}>
                      <TextField
                        label={localization.catalogAdmin.fieldNameDescription}
                        value={name || ''}
                        required
                        type='text'
                        isValid={validateNameField(name)}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          nameChangeHandler(event, index);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <Select
                        label={localization.catalogAdmin.fieldTypeDescription}
                        options={Object.values(fieldTypeOptions)}
                        value={internalFieldType || 'freetext'}
                        onChange={(value) => {
                          fieldTypeChangeHandler(value, index);
                        }}
                      />
                    </div>
                    {internalFieldType == 'codelist' && (
                      <div className={styles.field}>
                        <Select
                          label={localization.catalogAdmin.chooseCodeList}
                          options={Object.values(codelistOptions)}
                          value={codelistOptions[selectedCodelist]?.value || ''}
                          onChange={(value) => {
                            codelistChangeHandler(value, index);
                          }}
                        />
                      </div>
                    )}
                    <div className={styles.field}>
                      <div className={styles.accordionButtons}>
                        <div className={styles.saveButton}>
                          <Button
                            fullWidth={true}
                            size='small'
                            onClick={() => saveFieldHandler(index)}
                          >
                            {localization.button.save}
                          </Button>
                        </div>
                        <Button
                          color='danger'
                          size='small'
                          onClick={() => deleteFieldHandler(index)}
                        >
                          {localization.button.delete}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternalFieldsPage;
