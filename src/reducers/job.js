import { FETCH_JOB_STATS } from "../actions/types";

export const visitedJobReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_JOB_STATS:
      return action.payload;
    default:
      return state;
  }
};
