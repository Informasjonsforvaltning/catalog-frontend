import React from 'react';
import {render} from '@testing-library/react';
import SearchHit from '.';

describe('SearchHit', () => {
  it('should render SearchHit successfully', () => {
    const {baseElement} = render(
      <SearchHit
        searchHit={{
          id: 'bec18f0d-389e-4fa3-970d-23c1196cbe00',
          status: 'utkast',
          erPublisert: false,
          anbefaltTerm: {
            navn: {
              en: 'anbefalt og definisjon',
              nb: 'test 2',
            },
          },
          definisjon: {
            tekst: {
              nb: 'anbefalt og definisjon',
            },
          },

          ansvarligVirksomhet: {
            uri: null,
            id: '910244132',
            navn: null,
            orgPath: null,
            prefLabel: null,
          },
          endringslogelement: {
            brukerId: '4546f7f0-8ad1-35e2-9182-a5e49a2e59ed',
            endringstidspunkt: '2023-01-16T14:29:28.768+01:00',
          },

          tildeltBruker: {
            id: 'John Doe',
            navn: null,
            email: null,
          },
        }}
      />
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
