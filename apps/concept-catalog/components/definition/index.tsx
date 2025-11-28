import { Definisjon } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import classes from "./definition.module.css";
import { Link } from "@digdir/designsystemet-react";

interface Props {
  definition: Definisjon;
  language?: string;
}

export const Definition = ({ definition, language }: Props) => {
  const RelationToSource = () => {
    if (definition?.kildebeskrivelse?.forholdTilKilde === "egendefinert") {
      return localization.concept.selfDefined;
    } else if (
      definition?.kildebeskrivelse?.forholdTilKilde === "basertPaaKilde"
    ) {
      return `${localization.concept.basedOnSource}:`;
    } else if (
      definition?.kildebeskrivelse?.forholdTilKilde === "sitatFraKilde"
    ) {
      return `${localization.concept.quoteFromSource}:`;
    }
    return null;
  };

  return (
    <>
      <div>{getTranslateText(definition?.tekst, language)}</div>
      {(definition?.kildebeskrivelse?.forholdTilKilde === "egendefinert" ||
        definition?.kildebeskrivelse?.kilde.length !== 0) && (
        <div className={classes.source}>
          <div>
            <RelationToSource />
          </div>
          <div>
            {definition?.kildebeskrivelse?.kilde.length !== 0 && (
              <ul>
                {definition?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                  <li key={`kilde-${i}`}>
                    {kilde.uri ? (
                      <Link href={kilde.uri}>
                        {kilde.tekst ? kilde.tekst : kilde.uri}
                      </Link>
                    ) : (
                      <span>{kilde.tekst}</span>
                    )}
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
