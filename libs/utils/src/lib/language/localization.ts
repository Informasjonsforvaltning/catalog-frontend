import LocalizedStrings from "react-localization";
import { nb } from "./nb";
import { conceptHelptextsNb } from "./helptexts.concept.nb";
import { dataServiceFormNb } from "./data.service.form.nb";
import { datasetFormNb } from "./dataset.form.nb";
import { conceptFormNb } from "./concept.form.nb";
import { serviceFormNb } from "./service.form";

export const localization = new LocalizedStrings({
  nb: {
    ...nb,
    conceptHelptexts: { ...conceptHelptextsNb },
    conceptForm: { ...conceptFormNb },
    datasetForm: { ...datasetFormNb },
    dataServiceForm: { ...dataServiceFormNb },
    serviceForm: { ...serviceFormNb },
  },
});
localization.setLanguage("nb");
