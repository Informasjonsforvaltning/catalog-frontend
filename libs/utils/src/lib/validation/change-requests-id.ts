import { ChangeRequest } from "@catalog-frontend/types";

// a function that loops through changeRequest items and checks if the id field in the item matches the given id
export const validChangeRequestId = (
  changeRequests: Array<ChangeRequest>,
  id: string,
) => {
  for (const changeRequest of changeRequests) {
    if (changeRequest.id === id) {
      return true;
    }
  }
  return false;
};
