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
`
  },
  heading: {
    term: '1. Term'
  },
  fieldLabel: {
   
    prefLabel: 'Anbefalt term',
    altLabel: 'Tillat term',
    hiddenLabel: 'Frarådet term',
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
    divisionCriterion: 'Inndelingskriterium'
  },
  alert: {
    confirmDelete: 'Er du sikker på at du vil slette datasettbeskrivelsen?',
    formError: 'Du har feil i skjemaet. Rett opp i disse før du kan lagre.',
  },
  validation: {
    minLength: 'Verdien må være minst {length} karakterer lang.',
    required: 'Feltet er påkrevd.',
    invalidUrl: `Ugyldig lenke. Vennligst sørg for at lenken starter med ‘https://’ og inneholder et gyldig toppdomene (f.eks. ‘.no’).`,
  },
  
};
