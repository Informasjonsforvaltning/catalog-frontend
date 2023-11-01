import { FC } from 'react';
import styles from './source-for-definition.module.css';
import { Field } from 'formik';
import { Button, Textfield } from '@digdir/design-system-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { localization as loc } from '@catalog-frontend/utils';

interface Props {
  sourceTitleFieldName: string;
  sourceUriFieldName: string;
  deleteClickHandler: () => void;
}

export const SourceForDefinitionField: FC<Props> = ({
  sourceTitleFieldName,
  sourceUriFieldName,
  deleteClickHandler,
}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.row}>
          <Field
            name={sourceTitleFieldName}
            as={Textfield}
            label={'Tittel på kilde'}
            rows={1}
            cols={20}
          />
          <Field
            name={sourceUriFieldName}
            as={Textfield}
            label={'Lenke til kilde'}
            rows={1}
            cols={20}
          />
          <Button
            color='danger'
            icon={<TrashIcon />}
            size='small'
            onClick={deleteClickHandler}
          >
            {loc.formatString(loc.button.deleteWithFormat, { text: loc.concept.source.toLowerCase() })}
          </Button>
        </div>
      </div>
    </>
  );
};
