import { SET_IS_SMALL_SCREEN } from "./types";

export const setIsSmallScreen = (value) => {
  return (dispatch, getState) => {
    if (getState().smallScreen !== value) {
      dispatch({ type: SET_IS_SMALL_SCREEN, payload: value });
    }
  };
};
