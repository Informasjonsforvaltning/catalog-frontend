import { AccessRights, Dataset } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Button, Heading, NativeSelect, Textfield } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Field, FieldArray, FormikErrors, FormikHelpers } from 'formik';

type AccessRightsSectionProps = {
  errors: FormikErrors<Dataset>;
  values: Dataset;
};

export const AccessRightsSection = ({ errors, values }: AccessRightsSectionProps) => {
  return (
    <div>
      {/* <FormContainer.Header
          title={localization.datasetForm.heading.accessRights}
          subtitle={localization.datasetForm.helptext.accessRights}
        /> */}
      <Field name='accessRights.uri'>
        {({ field, form }: { field: any; form: FormikHelpers<Dataset> }) => (
          <NativeSelect
            {...field}
            label={
              <TitleWithTag
                title={localization.access}
                tagColor='info'
                tagTitle={localization.tag.recommended}
              />
            }
          >
            <option value={''}>{`${localization.choose}...`}</option>
            <option value={AccessRights.PUBLIC}>{localization.datasetForm.accessRight.public}</option>
            <option value={AccessRights.RESTRICTED}>{localization.datasetForm.accessRight.restricted}</option>
            <option value={AccessRights.NON_PUBLIC}>{localization.datasetForm.accessRight.nonPublic}</option>
          </NativeSelect>
        )}
      </Field>

      {(values.accessRights?.uri === AccessRights.RESTRICTED ||
        values.accessRights?.uri === AccessRights.NON_PUBLIC) && (
        <>
          <FormContainer.Header
            title={localization.datasetForm.heading.legalBasisForRestriction}
            subtitle={localization.datasetForm.helptext.legalBasisForRestriction}
          />
          <FieldArray name='legalBasisForRestriction'>
            {({ remove, push }) => (
              <>
                {values.legalBasisForRestriction?.map((_, index) => (
                  <div key={index}>
                    <Field
                      name={`legalBasisForRestriction[${index}].prefLabel.nb`}
                      as={Textfield}
                      label={localization.title}
                    />
                    <Field
                      name={`legalBasisForRestriction[${index}].uri`}
                      as={Textfield}
                      label={localization.link}
                      // @ts-expect-error uri exsists in object legalBasisForRestriction
                      error={errors?.legalBasisForRestriction?.[index]?.uri}
                    />
                    <Button
                      type='button'
                      onClick={() => remove(index)}
                      variant='tertiary'
                      color='danger'
                    >
                      <MinusCircleIcon />
                      {localization.remove}
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type='button'
                    onClick={() => push({ prefLabel: { nb: '' }, uri: '' })}
                    variant='tertiary'
                  >
                    <PlusCircleIcon />
                    {localization.add}
                  </Button>
                </div>
              </>
            )}
          </FieldArray>

          <FormContainer.Header
            title={localization.datasetForm.heading.legalBasisForProcessing}
            subtitle={localization.datasetForm.helptext.legalBasisForProcessing}
          />

          <FieldArray name='legalBasisForProcessing'>
            {({ remove, push }) => (
              <>
                {values.legalBasisForProcessing?.map((_, index) => (
                  <div key={index}>
                    <Field
                      name={`legalBasisForProcessing[${index}].prefLabel.nb`}
                      as={Textfield}
                      label={localization.title}
                    />
                    <Field
                      name={`legalBasisForProcessing[${index}].uri`}
                      as={Textfield}
                      label={localization.link}
                      // @ts-expect-error uri exsists in object legalBasisForProcessing
                      error={errors?.legalBasisForProcessing?.[index]?.uri}
                    />
                    <Button
                      type='button'
                      onClick={() => remove(index)}
                      variant='tertiary'
                      color='danger'
                    >
                      <MinusCircleIcon />
                      {localization.remove}
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type='button'
                    onClick={() => push({ prefLabel: { nb: '' }, uri: '' })}
                    variant='tertiary'
                  >
                    <PlusCircleIcon />
                    {localization.add}
                  </Button>
                </div>
              </>
            )}
          </FieldArray>

          <FormContainer.Header
            title={localization.datasetForm.heading.legalBasisForAccess}
            subtitle={localization.datasetForm.helptext.legalBasisForAccess}
          />

          <FieldArray name='legalBasisForAccess'>
            {({ remove, push }) => (
              <>
                {values.legalBasisForAccess?.map((_, index) => (
                  <div key={index}>
                    <Field
                      name={`legalBasisForAccess[${index}].prefLabel.nb`}
                      as={Textfield}
                      label={localization.title}
                    />
                    <Field
                      name={`legalBasisForAccess[${index}].uri`}
                      as={Textfield}
                      label={localization.link}
                      // @ts-expect-error uri exsists in object legalBasisForAccess
                      error={errors?.legalBasisForAccess?.[index]?.uri}
                    />
                    <Button
                      type='button'
                      onClick={() => remove(index)}
                      variant='tertiary'
                      color='danger'
                    >
                      <MinusCircleIcon />
                      {localization.remove}
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type='button'
                    onClick={() => push({ prefLabel: { nb: '' }, uri: '' })}
                    variant='tertiary'
                  >
                    <PlusCircleIcon />
                    {localization.add}
                  </Button>
                </div>
              </>
            )}
          </FieldArray>
        </>
      )}
    </div>
  );
};
