import { NOTIFICATION_FETCHED, NOTIFICATION_DELETED } from "../actions/types";
import _ from "lodash";
export const notificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_FETCHED:
      return { ...state, [action.payload.key]: action.payload.data };
    case NOTIFICATION_DELETED:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
