import React from 'react';
import { render } from '@testing-library/react';
import { SearchHit } from './';

describe('SearchHit', () => {
  it('should render SearchHit successfully', () => {
    const { baseElement } = render(
      <SearchHit
        searchHit={{
          id: 'bec18f0d-389e-4fa3-970d-23c1196cbe00',
          erPublisert: false,
          anbefaltTerm: {
            navn: {
              nb: 'test 2',
            },
          },
          definisjon: {
            tekst: {
              nb: 'anbefalt og definisjon',
            },
          },
          endringslogelement: {
            endringstidspunkt: '2023-01-16T14:29:28.768+01:00',
          },

          tildeltBruker: {
            id: 'John Doe',
          },
        }}
        catalogId={''}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
