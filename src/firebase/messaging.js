import firebase from "./firebase";
const database = firebase.database();

const updateContactMessages = (userId, contactId, lastMsg) => {
  const contactRef = database.ref(`/users-contacts/${userId}/${contactId}`);

  contactRef.once("value", (snap) => {
    contactRef.update({
      lastMsg: lastMsg,
      nUnseenMessages: lastMsg.sent
        ? 0
        : snap.val()
        ? snap.val().nUnseenMessages + 1
        : 1,
    });
  });
};
export const addContact = (contactId) => {
  const userId = firebase.auth().currentUser.uid;
  const date = new Date();
  updateContactMessages(userId, contactId, {
    body: null,
    sent: true,
    date: date.getTime(),
  });
};
export const markChatAsSeen = (contactId) => {
  const userId = firebase.auth().currentUser.uid;
  const contactRef = database.ref(`/users-contacts/${userId}/${contactId}`);

  contactRef.once("value", (snap) => {
    contactRef.update({ nUnseenMessages: 0 });
  });
};
export const sendMessage = (receiverId, messageData) => {
  const date = new Date();

  const userId = firebase.auth().currentUser.uid;

  messageData["date"] = date.getTime();
  messageData["seen"] = false;
  messageData["sent"] = true;

  const newMessageKey = database
    .ref(`/users-messages/${userId}/${receiverId}`)
    .push().key;

  const updates = {};
  updates[
    `/users-messages/${userId}/${receiverId}/${newMessageKey}`
  ] = messageData;
  updates[`/users-messages/${receiverId}/${userId}/${newMessageKey}`] = {
    ...messageData,
    sent: false,
  };

  updateContactMessages(receiverId, userId, {
    body: messageData.body,
    date: date.getTime(),
    sent: false,
  });
  updateContactMessages(userId, receiverId, {
    body: messageData.body,
    date: date.getTime(),
    sent: true,
  });
  return database.ref().update(updates);
};
