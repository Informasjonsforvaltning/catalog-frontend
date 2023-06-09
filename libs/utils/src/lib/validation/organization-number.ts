export const validOrganizationNumber = (organizationNumber: string) => {
  return organizationNumber?.match(/^\d{9}$/) !== null;
};
