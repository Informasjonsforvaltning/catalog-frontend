export const conceptFormNb = {
  helpText: {
    prefLabel: 'Termen blir sett på som best egnet for begrepet.',
    definition: `
Representasjon av et begrep ved et uttrykk som beskriver det og atskiller det fra relaterte begreper.

- __Uten målgruppe:__ Når definisjonen er generell og passer for alle uten spesiell tilpasning. 
- __Spesialister:__ For definisjoner med avansert fagterminologi eller innsikt som krever spesifikk kunnskap om emnet. 
- __Allmenheten:__ For en bredere gruppe, der definisjonen er tilpasset for å være lett forståelig for folk uten spesialkunnskap.`,
    contactInfo: `Egenskapen brukes til å oppgi kontaktpunkt som kan nås ved f.eks. spørsmål om begrepet.

Det er mulig å velge flere kontaktpunkter (e-post, telefonnummer og kontaktskjema).
`,
    relation: `
Et begrep kan ha relasjoner til andre begreper. En relasjon består av to begreper pluss en
betydning som kan uttrykkes med tekst eller type. Det finnes tre hovedgrupper av relasjoner:
generiske, partitive og assosiative.

__Generisk:__ enten det begrepet som dette begrepet spesialiserer, eller det begrepet som dette
begrepet generaliserer

__Partitiv:__ enten det begrepet som dette begrepet er del av, eller det begrepet som dette begrepet
inneholder

__Assosiativ:__ det begrepet som dette begrepet er relatert til, og med relasjonstype, eventuelt
uttrykt som begrepets relasjonsrolle overfor det andre begrepet

Relasjon _Se også_ og _Erstattes av_ er predefinerte assosiative relasjoner.
`,
    relationLevel: `Eksempler på ofte brukte relasjonsroller for begreper i assosiative relasjoner: 
    _har nært samsvar med_, _har eksakt samsvar med_.`,
    relatedConcept: `
Begynn å skrive i søkefeltet, og du vil få opp en liste med forslag basert på ditt søk. Klikk på ønsket begrep for å knytte det til det nåværende begrepet.

Velg _Egen definert_ om du har en lenke til begrepet.`,
    relationToSource: `
__Egen definert:__ Innholdet er egenutviklet og basert på egne analyser eller vurderinger, uten direkte referanse til eksterne kilder.

__Basert på kilde:__ Innholdet er inspirert av eller bygger på en spesifikk kilde, men inneholder omformulerte eller videreutviklede ideer.

__Sitat fra kilde:__ Innholdet er et direkte sitat eller nøyaktig gjengivelse fra en kilde, og må derfor oppgis med nøyaktig kildehenvisning.`,
    sources: `Du må ha minst én kilde, som kan bestå av en kildebeskrivelse, en URI, eller begge deler.`
  },
  section: {
    termTitle: 'Term',
    termSubtitle: 'Termen blir sett på som best egnet for begrepet.',
    definitionTitle: 'Definisjon',
    definitionSubtitle: 'En definisjon skal være en kort forklaring som tydelig avgrenser til andre, nærliggende begrep, evt. tydeliggjør forskjellen mellom dette begrepet og andre nærliggende begrep.',
    remarkTitle: 'Merknad',
    remarkSubtitle: 'Tillegsopplysninger som begrepets betydning som ikke hører hjemme i definisjonsfeltet.',
    subjectTitle: 'Fagområde',
    subjectSubtitle: 'Et fagområde er et spesialisert kunnskapsområde som begrepet tilhører.',
    exampleTitle: 'Eksempel',
    exampleSubtitle: 'Konkrete tilfeller av begrepet.',
    applicationTitle: 'Verdiområde',
    applicationSubtitle: 'Lovlig verdiområde for begrepet.'
  },  
  fieldLabel: {
   
    prefLabel: 'Anbefalt term',
    altLabel: 'Tillat term',
    hiddenLabel: 'Frarådet term',
    subjectLabel: 'Fagområde',
    remark: 'Merknad',
    example: 'Eksempel',
    description: 'Beskrivelse',
    status: 'Begrepsstatus',
    versionNote: 'Versjonsnote',
    definisjon: 'Definisjon',
    definitionTargetGroup: {
      definisjon: 'Uten målgruppe',
      definisjonForAllmennheten: 'Allmennheten', 
      definisjonForSpesialister: 'Spesialister'
    },
    definitionTargetGroupFull: {
      definisjon: 'Definisjon (uten målgruppe)',
      definisjonForAllmennheten: 'Definisjon for allmennheten', 
      definisjonForSpesialister: 'Definisjon for spesialister'
    },
    relationToSource: 'Forhold til kilde',
    sources: 'Kilder',
    relation: 'Relasjon',
    relationLevel: 'Nivå',
    relationTypes: {
      assosiativ: 'Assosiativ',
      generisk: 'Generisk',
      partitiv: 'Partitiv',
      seOgså: 'Se også',
      erstattesAv: 'Erstattes av',
    },
    relationSubtypes: {
      overordnet: 'Overordnet',
      underordnet: 'Underordnet',
      erDelAv: 'Er del av',
      omfatter: 'Omfatter'
    },
    relatedConcept: 'Relatert begrep',
    internalConcept: 'Internt begrep',
    divisionCriterion: 'Inndelingskriterium',
    emailAddress: 'E-postadresse',
    phoneNumber: 'Telefonnummer',
    contactForm: 'Kontaktskjema'
  },
  alert: {
    confirmDelete: 'Er du sikker på at du vil slette datasettbeskrivelsen?',
    formError: 'Du har feil i skjemaet. Rett opp i disse før du kan lagre.',
  },
  validation: {
    minLength: 'Verdien må være minst {length} karakterer lang.',
    required: 'Feltet er påkrevd.',
    invalidUrl: `Ugyldig lenke. Vennligst sørg for at lenken starter med ‘https://’ og inneholder et gyldig toppdomene (f.eks. ‘.no’).`,
    minOneSource: 'Du må ha minst en kilde',
    version: 'Versjon må være større en v{min}',
    languageRequired: '{label} ({language}) er påkrevd'
  },
  
};
