/* Color in hex format #000 or #000000 */
export const colorRegex = /#([A-Fa-f0-9]{3}){1,2}\b/;

/* Can contain letters and spaces, including accented characters like æøå */
export const textRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėæįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]*$/u;

/* Same as above but with numbers */
export const textRegexWithNumbers =
  /^[a-zA-Z0-9àáâäãåąčćęèéêëėæįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]*$/u;

/* Must be a valid email address or empty*/
export const emailRegex = /^(?:[\w.-]+@[\w-]+\.[\w-]{2,4})?$/;

/* Must be a valid telephone number, optionally starting with + */
export const telephoneNumberRegex = /^(?:[+\d\s]*)$/;

/* Must start with https://, case insensitive */
export const httpsRegex = /^[hH][tT][tT][pP][sS]:\/\//;

export const conceptIdFromUriRegex = /\/([0-9a-fA-F-]{36})$/;

export const onlyNumbersRegex = /^\d+$/;

export const containsNonNumberRegex = /[^\d]/;
