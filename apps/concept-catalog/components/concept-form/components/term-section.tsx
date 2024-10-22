import { Concept } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Fieldset, Heading, Tabs, Textfield } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import styles from '../concept-form.module.css';

export const TermSection = () => {
  const { errors } = useFormikContext<Concept>();
  
  return (
    <div>
      
      <FormContainer>
        <FormContainer.Header
          title="1. Term"
          subtitle="Term består av anbefalt, tillat og frarådet term."
        />
        <FormContainer.Header
            title="Anbefalt term"
            subtitle="Termen blir sett på som best egnet for begrepet."
            variant='secondary'
          />
        <Tabs
          defaultValue="nb"
          size="md"
        >
          <Tabs.List>
            <Tabs.Tab value="nb">
              Bokmål
            </Tabs.Tab>
            <Tabs.Tab value="value2">
              Nynorsk
            </Tabs.Tab>
            <Tabs.Tab value="value3">
              Engelsk
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value='nb' className={styles.tabContent}>
            <FastField
              as={Textfield}
              name='anbefaltTerm.navn.nb'
              label={
                <TitleWithTag
                  title={localization.conceptForm.fieldLabel.recommendedTerm}
                  tagTitle={localization.tag.required}
                />
              }
              error={errors?.anbefaltTerm?.navn?.nb}
            />
          </Tabs.Content>
        </Tabs>        
       
        <FormContainer.Header
          title="Tillat term"
          subtitle="Termen blir sett på som best egnet for begrepet, og som blir brukt i tillegg til en anbefalt term."
          variant='secondary'
        />
        <FastField
          as={Textfield}
          name='anbefaltTerm.navn.nb'
          label={localization.conceptForm.fieldLabel.allowedTerm}
          error={errors?.anbefaltTerm?.navn?.nb}
        />
        <FormContainer.Header
          title="Frarådet term"
          subtitle="Term som blir sett på som uegnet for begrepet."
          variant='secondary'
        />
        <FastField
          as={Textfield}
          name='anbefaltTerm.navn.nb'
          label={localization.conceptForm.fieldLabel.advisedTerm}
          error={errors?.anbefaltTerm?.navn?.nb}
        />
      </FormContainer>
    </div>
  );
};
