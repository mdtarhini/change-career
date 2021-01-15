import { CONTACT_FETCHED, SELECT_CHAT } from "../actions/types";

export const contactsReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTACT_FETCHED:
      return { ...state, [action.payload.key]: action.payload.data };

    default:
      return state;
  }
};
export const selectedChatReducer = (state = null, action) => {
  switch (action.type) {
    case SELECT_CHAT:
      return action.payload;
    default:
      return state;
  }
};
