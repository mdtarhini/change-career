import { SELECT_CHAT, CONTACT_FETCHED } from "./types";
import { addContact } from "../firebase/messaging";
export const contactFetched = (contactKey, contactData) => {
  return {
    type: CONTACT_FETCHED,
    payload: { key: contactKey, data: contactData },
  };
};

export const selectChat = (contactKey) => {
  return (dispatch, getState) => {
    if (!getState().contacts[contactKey]) {
      addContact(contactKey);
    }
    dispatch({ type: SELECT_CHAT, payload: contactKey });
  };
};
