export const validUUID = (uuid?: string | null) => {
  return uuid?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3,4}-[0-9a-f]{3,4}-[0-9a-f]{12}$/i) !== null;
};
