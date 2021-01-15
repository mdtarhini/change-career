import firebase from "./firebase";
const database = firebase.database();

export const markNotificationAsSeen = (notifKey) => {
  const userId = firebase.auth().currentUser.uid;
  const notifRef = database.ref(`/users-notifications/${userId}/${notifKey}`);
  return notifRef.update({ seen: true });
};

export const deleteNotification = (notifKey) => {
  const userId = firebase.auth().currentUser.uid;
  const notifRef = database.ref(`/users-notifications/${userId}/${notifKey}`);
  notifRef.remove();
};
