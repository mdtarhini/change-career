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
} from "../actions/types";

const initialState = {
  user: null,
  errorMessage: "",
  message: "",
  doingSomething: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_DOING_SOMETHING:
      return { ...state, doingSomething: true, errorMessage: "", message: "" };
    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        doingSomething: false,
        errorMessage: "",
        message: "",
      };
    case USER_LOADED:
      return {
        user: action.payload,
        doingSomething: false,
        errorMessage: "",
        message: "",
      };
    case SIGN_IN_FAILED:
    case SIGN_UP_FAILED:
    case PASSWORD_RESET_FAILED:
      return {
        user: null,
        doingSomething: false,
        errorMessage: action.payload,
        message: "",
      };
    case SIGN_OUT_SUCCESS:
      return {
        user: null,
        doingSomething: false,
        errorMessage: "",
        message: "",
      };
    case PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        doingSomething: false,
        message: "Instructions to reset your password were sent to your email!",
      };
    default:
      return state;
  }
};
export default authReducer;
