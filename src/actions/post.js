import { SET_NEW_POST_VISIBILITY, SET_EXPANDED_POST } from "./types";

export const initNewPost = () => {
  return { type: SET_NEW_POST_VISIBILITY, payload: true };
};
export const cancelNewPost = () => {
  return { type: SET_NEW_POST_VISIBILITY, payload: false };
};

export const setExpandedPost = (postId) => {
  return { type: SET_EXPANDED_POST, payload: postId };
};
