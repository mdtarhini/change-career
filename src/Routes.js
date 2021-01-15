import React from "react";
import { Switch, Route, Router } from "react-router-dom";
import history from "./history";

import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import SignUpOrSignIn from "./components/Setup/SignUpOrSignIn";
import Setup from "./components/Setup/Setup";
import Notifications from "./components/Notifications/Notifications";
import Messaging from "./components/Messaging/Messaging";
import Job from "./components/Job/Job";
import Navbar from "./components/Navbar/Navbar";
import Post from "./components/Post/Post";
const Routes = (props) => {
  const listOfPrivateComponents = [
    { path: "/setup/:editOrSetup", component: Setup },
    { path: "/messaging", component: Messaging },
    { path: "/notifications", component: Notifications },
  ];
  const listOfPublicComponents = [
    { path: "/", component: Home },
    { path: "/signin", component: SignUpOrSignIn },
    { path: "/signup", component: SignUpOrSignIn },
    { path: "/forgotpassword", component: SignUpOrSignIn },
    { path: "/profile/:id", component: Profile },
    { path: "/job/:jobId", component: Job },
    { path: "/post/:postId", component: Post },
  ];
  return (
    <Router history={history}>
      <Route path="/" component={Navbar} />
      <Switch>
        {listOfPrivateComponents.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              exact
              component={props.auth.user ? route.component : Home}
            />
          );
        })}
        {listOfPublicComponents.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              exact
              component={route.component}
            />
          );
        })}
      </Switch>
    </Router>
  );
};

export default Routes;
