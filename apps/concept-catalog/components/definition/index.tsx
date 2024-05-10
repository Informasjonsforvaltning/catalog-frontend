import { Definisjon } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import cn from 'classnames';
import classes from './definition.module.css';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  definition: Definisjon;
  language?: string;
}

export const Definition = ({ definition, language }: Props) => {
  return (
    <>
      <div>{getTranslateText(definition?.tekst ?? '', language)}</div>
      {(definition?.kildebeskrivelse?.forholdTilKilde === 'egendefinert' ||
        definition?.kildebeskrivelse?.kilde.length !== 0) && (
        <div className={cn(classes.source)}>
          <div>{localization.concept.source}:</div>
          <div>
            {definition?.kildebeskrivelse?.forholdTilKilde === 'egendefinert' ? (
              localization.concept.selfDefined
            ) : (
              <ul>
                {definition?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                  <li key={`kilde-${i}`}>
                    {kilde.uri ? <Link href={kilde.uri}>{kilde.tekst}</Link> : <span>{kilde.tekst}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Definition;
