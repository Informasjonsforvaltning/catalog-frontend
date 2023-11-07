export const validOrganizationNumber = (organizationNumber: string) => {
  return RegExp(/^\d{9}$/).exec(organizationNumber) !== null;
};
