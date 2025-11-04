export const convertTimestampToDateAndTime = (timestamp: string): string => {
  const dateObject = new Date(timestamp);

  const day = dateObject.getDate().toString().padStart(2, "0");
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
