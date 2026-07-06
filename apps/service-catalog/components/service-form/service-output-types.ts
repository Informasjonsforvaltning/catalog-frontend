const SERVICE_OUTPUT_TYPE_BASE =
  "https://data.norge.no/vocabulary/service-output-type";

export const SERVICE_OUTPUT_TYPES: { uri: string; label: string }[] = [
  { uri: `${SERVICE_OUTPUT_TYPE_BASE}#declaration`, label: "Erklæring" },
  {
    uri: `${SERVICE_OUTPUT_TYPE_BASE}#financial-benefit`,
    label: "Økonomisk fordel",
  },
  {
    uri: `${SERVICE_OUTPUT_TYPE_BASE}#financial-obligation`,
    label: "Økonomisk forpliktelse",
  },
  {
    uri: `${SERVICE_OUTPUT_TYPE_BASE}#identifier`,
    label: "Identifikator eller aksesskode",
  },
  { uri: `${SERVICE_OUTPUT_TYPE_BASE}#permit`, label: "Tillatelse" },
  {
    uri: `${SERVICE_OUTPUT_TYPE_BASE}#physical-object`,
    label: "Fysisk objekt",
  },
  { uri: `${SERVICE_OUTPUT_TYPE_BASE}#recogntion`, label: "Anerkjennelse" },
  { uri: `${SERVICE_OUTPUT_TYPE_BASE}#rights`, label: "Rettighet" },
];

export const serviceOutputTypeLabel = (uri: string): string =>
  SERVICE_OUTPUT_TYPES.find((item) => item.uri === uri)?.label ?? uri;
