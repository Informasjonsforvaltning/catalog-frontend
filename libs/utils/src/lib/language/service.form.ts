export const serviceFormNb = {
  alert: {
    unpublishBeforeIgnoreRequired:
      "Du må avpublisere tjenesten før du kan ignorere påkrevde felt.",
  },
  fieldLabel: {
    category: "Navn",
    contactPage: "Kontaktside",
    contactPoint: "Kontaktinformasjon",
    dctType: "Hovedformål",
    description: "Beskrivelse",
    email: "E-post",
    homepage: "Hjemmeside",
    ignoreRequired: "Ignorer påkrevde felt",
    produces: "Produserer",
    spatial: "Dekningsområde",
    status: "Status",
    subject: "Begrep",
    telephone: "Telefon",
    title: "Tittel",
  },
  helptext: {
    category: "Brukes til å oppgi navnet til kontaktpunktet.",
    contactPoint:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om tjenesten. Minst ett av feltene må fylles ut for å oppfylle kravet til kontaktpunkt.",
    dctType:
      "Tjenestens hovedformål. Dette kan velges blant EU’s kontrollerte vokabular [main activity](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/main-activity).",
    description:
      "Beskrivelsen skal være kortfattet og formålet med tjenesten bør fremgå.",
    homepage:
      "Lenke til en nettside som gir tilgang til tjenesten og/eller tilleggsinformasjon.",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare tittel være fylt ut.",
    produces:
      "Egenskapen brukes til å referere til en eller flere instanser av tjenesteresultat som beskriver resultat av tjenesten.",
    spatial: "Geografiske områder som tjenesten dekker.",
    status: "Velg tjenestens nåværende status.",
    subject:
      "Velg begrep registrert i [begrepskatalogen til data.norge](https://data.norge.no/concepts). Ved å henvise til gjennomarbeidede beskrivelser som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i tjenesten skal forstås og at denne forståelsen er riktig og oppdatert.",
    title: "Navnet skal være kortfattet, kunne stå alene og gi mening.",
  },
  section: {
    about: {
      subtitle: "Nøkkelinformasjon om tjenesten.",
      title: "Om tjenesten",
    },
    contactPoint: {
      subtitle:
        "Kontaktpunkt som kan brukes vedr. spørsmål og kommentarer om tjenesten.",
      title: "Kontaktpunkt",
    },
    produces: {
      subtitle:
        "Referanser til tjenesteresultater som beskriver tjenestens resultat.",
      title: "Produserer",
    },
  },
  validation: {
    contactPoints: "Minst en verdi må fylles ut for kontaktpunktet.",
    description: "Beskrivelsen må være minst 5 karakterer lang.",
    title: "Tittelen må være minst 3 karakterer lang.",
  },
};
