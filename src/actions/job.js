import { FETCH_JOB_STATS } from "./types";
import firebase from "../firebase/firebase";

export const fetchJobStats = (jobId) => {
  const database = firebase.database();

  return (dispatch) => {
    database
      .ref(`/jobs/${jobId}`)
      .once("value")
      .then((snapshot) => {
        dispatch({ type: FETCH_JOB_STATS, payload: snapshot.val() });
      });
  };
};
