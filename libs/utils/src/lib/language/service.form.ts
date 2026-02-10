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
    language: "Språk",
    page: "Relatert informasjon",
    produces: "Produserer",
    requiredEvidence: "Påkrevd dokumentasjon",
    spatial: "Dekningsområde",
    status: "Status",
    subject: "Begrep",
    telephone: "Telefon",
    title: "Tittel",
    type: "Type",
    validityDuration: "Gyldighetsperiode",
  },
  helptext: {
    category: "Brukes til å oppgi navnet til kontaktpunktet.",
    contactPoint:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om tjenesten. Minst ett av feltene må fylles ut for å oppfylle kravet til kontaktpunkt.",
    dctType:
      "Tjenestens hovedformål. Dette kan velges blant EU's kontrollerte vokabular [main activity](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/main-activity).",
    description:
      "Beskrivelsen skal være kortfattet og formålet med tjenesten bør fremgå.",
    homepage:
      "Lenke til en nettside som gir tilgang til tjenesten og/eller tilleggsinformasjon.",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare tittel være fylt ut.",
    language:
      "Egenskapen brukes til å oppgi språk som den påkrevde dokumentasjonen skal være på.",
    page: "Egenskapen brukes til å referere til mer informasjon om den påkrevde dokumentasjonen, f.eks. en bestemt mal til dokumentasjonen eller en veiledning for hvordan man skal formatere dokumentasjonen.",
    produces:
      "Egenskapen brukes til å referere til en eller flere instanser av tjenesteresultat som beskriver resultat av tjenesten.",
    requiredEvidence:
      "For å kunne levere en tjeneste kan det kreves dokumentasjon. Hvis dokumentasjon som kreves varierer avhengig av kanal tjenesten tilbys gjennom, BØR tilsvarende egenskap i klassen Tjenestekanal benyttes.",
    spatial: "Geografiske områder som tjenesten dekker.",
    status: "Velg tjenestens nåværende status.",
    subject:
      "Velg begrep registrert i [begrepskatalogen til data.norge](https://data.norge.no/concepts). Ved å henvise til gjennomarbeidede beskrivelser som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i tjenesten skal forstås og at denne forståelsen er riktig og oppdatert.",
    title: "Navnet skal være kortfattet, kunne stå alene og gi mening.",
    type: "Egenskapen brukes til å referere til begrepet som representerer typen dokumentasjonen tilhører.",
    validityDuration:
      "Egenskapen brukes til å angi en tidsperiode som den påkrevd dokumentasjonen skal være gyldig innenfor.",
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
    requiredEvidence: {
      subtitle: "Dokumentasjon som er påkrevd av tjenesten.",
      title: "Påkrevd dokumentasjon",
    },
  },
  validation: {
    contactPoints: "Minst en verdi må fylles ut for kontaktpunktet.",
    description: "Beskrivelsen må være minst 5 karakterer lang.",
    title: "Tittelen må være minst 3 karakterer lang.",
  },
};
