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
    dataset: "Datasett",
    email: "E-post",
    evidence: "Dokumentasjonskrav",
    homepage: "Hjemmeside",
    ignoreRequired: "Ignorer påkrevde felt",
    language: "Språk",
    losTheme: "Temaområde",
    name: "Navn",
    produces: "Produserer",
    relatedDocumentation: "Relatert dokumentasjon",
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
      "Tjenestens hovedformål. Dette kan velges blant EU's kontrollerte vokabular [main activity](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/main-activity).",
    description:
      "Beskrivelsen skal være kortfattet og formålet med tjenesten bør fremgå.",
    dataset: "Velg datasett som beskriver dokumentasjonen som kreves.",
    evidence:
      "Brukes til å spesifisere type dokumentasjon som er påkrevd av tjenesten.",
    homepage:
      "Lenke til en nettside som gir tilgang til tjenesten og/eller tilleggsinformasjon.",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare tittel være fylt ut.",
    language: "Velg tillatte språk for dokumentasjonen.",
    losTheme:
      "Primært temaområde som dekkes av tjenesten. Listen er fra [LOS](https://psi.norge.no/los/struktur.html), et felles vokabular som er temainndelt for å kategorisere og beskrive offentlige tjenester og ressurser i Norge. Velg det eller de mest presise temaene som er dekkende.",
    produces:
      "Egenskapen brukes til å referere til en eller flere instanser av tjenesteresultat som beskriver resultat av tjenesten.",
    relatedDocumentation:
      "Lenker til mer informasjon om dokumentasjonen, for eksempel maler eller veiledning. Hver lenke må være en gyldig URL.",
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
    evidence: {
      subtitle: "Referanser til dokumentasjon som er påkrevd av tjenesten.",
      title: "Dokumentasjonskrav",
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
    name: "Navnet må være minst 3 karakterer lang.",
    title: "Tittelen må være minst 3 karakterer lang.",
  },
};
