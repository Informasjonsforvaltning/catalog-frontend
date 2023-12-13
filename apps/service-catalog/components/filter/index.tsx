'use client';
import { Accordion } from '@digdir/design-system-react';
import styles from './filter.module.css';

type Props = {};

export const Filter = ({}: Props) => {
  return (
    <>
      <Accordion color='neutral'>
        <Accordion.Item>
          <Accordion.Header level={3}>Hvem kan registrere seg i Frivillighetsregisteret?</Accordion.Header>
          <Accordion.Content>
            For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen drive frivillig virksomhet. Det er
            bare foreninger, stiftelser og aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler til
            fysiske personer. Virksomheten må ha et styre.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header level={3}>
            Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
          </Accordion.Header>
          <Accordion.Content>
            Virksomheten må være registrert i Enhetsregisteret før den kan bli registrert i Frivillighetsregisteret. Du
            kan registrere i begge registrene samtidig i Samordnet registermelding.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default Filter;
