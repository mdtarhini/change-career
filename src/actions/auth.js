import {
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  USER_LOADED,
  SIGN_OUT_SUCCESS,
  USER_DOING_SOMETHING,
  PASSWORD_RESET_FAILED,
  PASSWORD_RESET_SUCCESS,
} from "./types";
import firebase from "../firebase/firebase";
import { editUserProfile } from "../firebase/users";
import history from "../history";

export const signUp = ({ email, password, firstName, lastName }) => {
  return (dispatch) => {
    dispatch({ type: USER_DOING_SOMETHING });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          editUserProfile({ firstName, lastName }).then(() => {
            dispatch({ type: SIGN_UP_SUCCESS, payload: user });
            history.push("/setup/firstSetup");
          });
        }
      })
      .catch((error) => {
        dispatch({ type: SIGN_UP_FAILED, payload: error.message });
      });
  };
};

export const signIn = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: USER_DOING_SOMETHING });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch({ type: SIGN_IN_SUCCESS, payload: user });
        history.push("/");
      })
      .catch((error) => {
        dispatch({ type: SIGN_IN_FAILED, payload: error.message });
      });
  };
};
export const restorePassword = ({ email }) => {
  return (dispatch) => {
    dispatch({ type: USER_DOING_SOMETHING });
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        dispatch({ type: PASSWORD_RESET_SUCCESS });
      })
      .catch((error) => {
        dispatch({ type: PASSWORD_RESET_FAILED, payload: error.message });
      });
  };
};

export const userLoadedFromSession = (user) => {
  return { type: USER_LOADED, payload: user };
};

export const signOut = () => {
  return (dispatch) => {
    dispatch({ type: USER_DOING_SOMETHING });
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: SIGN_OUT_SUCCESS });
        history.push("/");
      });
  };
};
