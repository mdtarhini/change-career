import { combineReducers } from "redux";
import { SET_IS_SMALL_SCREEN } from "../actions/types";
import authReducer from "./auth";
import { newPostVisibilityReducer, expandedPostReducer } from "./post";
import { visitedJobReducer } from "./job";
import { notificationsReducer } from "./notifications";
import { contactsReducer, selectedChatReducer } from "./messaging";
const smallScreenReducer = (state = false, action) => {
  switch (action.type) {
    case SET_IS_SMALL_SCREEN:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  smallScreen: smallScreenReducer,
  auth: authReducer,
  newPostVisibility: newPostVisibilityReducer,
  expandedPost: expandedPostReducer,
  visitedJob: visitedJobReducer,
  notifications: notificationsReducer,
  contacts: contactsReducer,
  selectedChat: selectedChatReducer,
});
