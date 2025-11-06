import { Code, CodeList } from "@catalog-frontend/types";
import { AdminState } from "./state";

// add new action types here as needed: E.g. 'POPULATE' | 'UPDATE'
type ACTION_TYPE =
  | "POPULATE"
  | "SET_BACKGROUND_COLOR"
  | "SET_FONT_COLOR"
  | "SET_LOGO"
  | "SET_CODE_LISTS"
  | "SET_SHOW_USER_EDITOR"
  | "SET_SHOW_INTERNAL_FIELD_EDITOR"
  | "SET_SHOW_CODE_LIST_EDITOR"
  | "SET_UPDATED_CODES";

// add new payload types here as needed
type ACTION_PAYLOAD =
  | AdminState
  | ({ backgroundColor: string } & { fontColor: string } & {
      logo: string | null | undefined;
    } & {
      updatedCodeLists: CodeList[];
    } & {
      showUserEditor: boolean;
    } & { showInternalFieldEditor: boolean } & {
      showCodeListEditor: boolean;
    } & {
      updatedCodes: Record<string, Code[]>;
    });

export type ACTION = { type: ACTION_TYPE; payload: ACTION_PAYLOAD };

export const action = (type: ACTION_TYPE, payload: ACTION_PAYLOAD) => ({
  type,
  payload,
});
