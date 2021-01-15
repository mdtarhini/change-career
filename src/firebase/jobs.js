import firebase from "./firebase";

const updateJobStatWRTAnother = (
  job = "1",
  wrt = "2",
  on = "joiners",
  incrementBy = 1
) => {
  const database = firebase.database();

  const jobRef = database.ref(`jobs/${job}/${on}/`);

  jobRef.once("value", (snap) => {
    if (snap.val()) {
      if (snap.val()[wrt]) {
        jobRef.update({ [wrt]: snap.val()[wrt] + incrementBy });
      } else {
        jobRef.update({ [wrt]: 1 });
      }
    } else {
      jobRef.update({ [wrt]: 1 });
    }
  });
};
export const updateJobsStat = (changeFrom, changeTo, incrementBy) => {
  updateJobStatWRTAnother(changeFrom, changeTo, "leavers", incrementBy);
  updateJobStatWRTAnother(changeTo, changeFrom, "joiners", incrementBy);
};
