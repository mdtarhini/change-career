import {
  SET_NEW_POST_VISIBILITY,
  CLEAR_POSTS,
  SET_EXPANDED_POST,
} from "../actions/types";
export const newPostVisibilityReducer = (state = false, action) => {
  switch (action.type) {
    case SET_NEW_POST_VISIBILITY:
      return action.payload;
    default:
      return state;
  }
};

export const expandedPostReducer = (state = null, action) => {
  switch (action.type) {
    case SET_EXPANDED_POST:
      return action.payload;
    case CLEAR_POSTS:
      return null;
    default:
      return state;
  }
};
