import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import "./App.css";
import { setIsSmallScreen } from "./actions";
import { userLoadedFromSession } from "./actions/auth";
import Routes from "./Routes";
import firebase from "./firebase/firebase";
import {
  notificationFetched,
  notificationDeleted,
} from "./actions/notifications";
import { contactFetched } from "./actions/messaging";

const App = ({
  userLoadedFromSession,
  setIsSmallScreen,
  auth,
  contactFetched,
  notificationFetched,
}) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      userLoadedFromSession(user);
    });
  }, [userLoadedFromSession]);

  useEffect(() => {
    let notificationsRef;
    let contactsRef;
    const database = firebase.database();

    if (auth.user) {
      //fetch notifications
      notificationsRef = database.ref(`users-notifications/${auth.user.uid}`);

      notificationsRef.on("child_added", (data) => {
        notificationFetched(data.key, data.val());
      });
      notificationsRef.on("child_changed", (data) => {
        notificationFetched(data.key, data.val());
      });
      notificationsRef.on("child_removed", (data) => {
        notificationDeleted(data.key);
      });

      //fetch contacts (not real contacts but people who chatted)
      contactsRef = database.ref(`users-contacts/${auth.user.uid}`);
      contactsRef.on("child_added", (data) => {
        contactFetched(data.key, data.val());
      });
      contactsRef.on("child_changed", (data) => {
        contactFetched(data.key, data.val());
      });
    }
  }, [auth, notificationFetched, contactFetched]);

  // console.log(auth?.user);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 770);
    window.addEventListener("resize", () => {
      setIsSmallScreen(window.innerWidth < 770);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsSmallScreen(window.innerWidth < 770);
      });
    };
  }, [setIsSmallScreen]);

  return (
    <div>
      <Routes auth={auth} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, {
  setIsSmallScreen,
  userLoadedFromSession,
  contactFetched,
  notificationFetched,
  notificationDeleted,
})(App);
