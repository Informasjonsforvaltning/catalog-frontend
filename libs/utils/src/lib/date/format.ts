export const formatISO = (isoDate: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  const d = new Date(isoDate);
  return d.toLocaleString('no-NO', options);
};
