import firebase from "./firebase";
const database = firebase.database();

export const editUserProfile = (values) => {
  const user = firebase.auth().currentUser;
  const userId = user.uid;

  return database.ref(`users/${userId}`).set({ ...values });
};

//for only once getting
export const getUserProfile = (userId) => {
  return database.ref("/users/" + userId).once("value");
};
