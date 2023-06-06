import { AdminState } from './state';

// add new action types here as needed: E.g. 'POPULATE' | 'UPDATE'
export type ACTION_TYPE = 'POPULATE' | 'SET_BACKGROUND_COLOR' | 'SET_FONT_COLOR';

// add new payload types here as needed
export type ACTION_PAYLOAD = AdminState | ({ backgroundColor: string } & { fontColor: string });

export type ACTION = { type: ACTION_TYPE; payload: ACTION_PAYLOAD };

export const action = (type: ACTION_TYPE, payload: ACTION_PAYLOAD) => ({
  type,
  payload,
});
