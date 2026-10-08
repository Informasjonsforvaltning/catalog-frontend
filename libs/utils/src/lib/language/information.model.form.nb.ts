export const informationModelFormNb = {
  helptext: {
    title:
      "Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.",
    description:
      "Beskrivelsen skal være kortfattet. Det bør fremgå hva informasjonsmodellen handler om, slik at den er enklere å finne og skille fra andre modeller.",
    status:
      "Angi modellens modenhet og utviklingsstadium. Verdiene hentes fra EUs kontrollerte vokabular [Product status](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/product-status).",
    homepage:
      "Lenke til en nettside med mer informasjon om informasjonsmodellen. Adressen må starte med https://.",
    contactName:
      "Navnet på kontaktpunktet. Typisk en organisasjon eller enhet.",
    contactFields:
      "Kontaktinformasjon for kontaktpunktet. Minst én av e-post eller kontaktside må fylles ut.",
    publish:
      "Publiser informasjonsmodellbeskrivelsen til Data.norge.no. For å publisere må du fylle ut alle påkrevde felt i skjemaet, en beskrivelse kan ikke slettes så lenge den er publisert.",
    version: `
Versjonsnummeret følger formatet 'major.minor.patch', hvor:
- __Major__ økes ved store endringer som ikke er bakoverkompatible.
- __Minor__ økes ved nye funksjoner eller forbedringer som er bakoverkompatible.
- __Patch__ økes ved feilrettinger og mindre justeringer.

Eksempel: Versjon 2.1.3 betyr andre hovedversjon, første mindre oppdatering, og tredje feilretting.`,
    creator:
      "Produsent brukes når eieren av informasjonsmodellen er en annen enn utgiveren. Velg virksomhet fra Enhetsregisteret.",
    subjects:
      "Velg begrep registrert i [begrepskatalogen til data.norge](https://data.norge.no/concepts). Ved å henvise til gjennomarbeidede beskrivelser som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i informasjonsmodellen skal forstås og at denne forståelsen er riktig og oppdatert.",
  },
  heading: {
    about: "Om informasjonsmodellen",
    subjects: "Begreper",
    contactPoint: "Kontaktpunkt",
  },
  subtitle: {
    about: "Nøkkelinformasjon om informasjonsmodellen.",
    subjects:
      "Begrepsbeskrivelser gir felles og tydelige rammer for å forstå og tolke innholdet i informasjonsmodellen.",
    contactPoint:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om informasjonsmodellen. Det skal ikke oppgis personlig kontaktinformasjon.",
  },
  fieldLabel: {
    title: "Tittel",
    description: "Beskrivelse",
    status: "Modellstatus",
    homepage: "Hjemmeside",
    version: "Versjonsnummer",
    creator: "Produsent",
    subjects: "Begreper",
    informationModelID: "Informasjonsmodell-ID",
    lastModified: "Sist endret",
    contactName: "Navn",
    contactFields: "Kontaktinformasjon",
    ignoreRequired: "Ignorer påkrevde felt",
  },
  noStatus: "Ingen status",
  alert: {
    confirmDeleteTitle: "Bekreft sletting",
    confirmDelete:
      "Er du sikker på at du vil slette informasjonsmodellbeskrivelsen?",
    confirmPublish:
      "Er du sikker på at du vil publisere informasjonsmodellbeskrivelsen?",
    confirmUnpublish:
      "Er du sikker på at du vil avpublisere informasjonsmodellbeskrivelsen?",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare tittel være fylt ut.",
    titleNotDefined: "Tittel ikke definert",
  },
  validation: {
    description: "Beskrivelsen må være minst 5 karakterer lang.",
    contactPoints:
      "Minst e-post eller kontaktside må fylles ut for kontaktpunktet.",
    version:
      "Versjonsnummer må fylles ut med major, minor og patch, eller være tomt.",
  },
  errors: {
    creator: "Kunne ikke hente enheter.",
  },
  button: {
    update: "Oppdater",
  },
};
