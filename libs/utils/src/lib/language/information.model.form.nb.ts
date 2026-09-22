export const informationModelFormNb = {
  helptext: {
    title:
      "Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.",
    description:
      "Beskrivelsen skal være kortfattet. Det bør fremgå hva informasjonsmodellen handler om, slik at den er enklere å finne og skille fra andre modeller.",
    status:
      "Angi modellens modenhet og utviklingsstadium. Verdiene hentes fra EUs kontrollerte vokabular [Product status](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/product-status).",
    contactName:
      "Navnet på kontaktpunktet. Typisk en organisasjon eller enhet.",
    contactFields:
      "Kontaktinformasjon for kontaktpunktet. Minst én av e-post eller kontaktside må fylles ut.",
    publish:
      "Publiser informasjonsmodellbeskrivelsen til Data.norge.no. For å publisere må du fylle ut alle påkrevde felt i skjemaet, en beskrivelse kan ikke slettes så lenge den er publisert.",
  },
  heading: {
    about: "Om informasjonsmodellen",
    contactPoint: "Kontaktpunkt",
  },
  subtitle: {
    about: "Nøkkelinformasjon om informasjonsmodellen.",
    contactPoint:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om informasjonsmodellen. Det skal ikke oppgis personlig kontaktinformasjon.",
  },
  fieldLabel: {
    title: "Tittel",
    description: "Beskrivelse",
    status: "Modellstatus",
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
  },
  button: {
    update: "Oppdater",
  },
};
