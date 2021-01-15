import React from "react";
import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import history from "../../history";
import { signOut } from "../../actions/auth";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import DropDownMenu from "../Common/DropDownMenu";
import { Avatar } from "antd";
import firebase from "../../firebase/firebase";
import { getUserProfile } from "../../firebase/users";
const User = ({ auth, signOut }) => {
  const [userProfile, setUserProfile] = useState(null);

  const getAndSetUserProfile = useCallback(() => {
    getUserProfile(auth.user.uid).then((snapshot) => {
      setUserProfile(snapshot.val());
    });
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    if (auth && isMounted) {
      getAndSetUserProfile();
      let userProfileRef = firebase.database().ref("users/" + auth.user.uid);
      userProfileRef.on("value", () => {
        getAndSetUserProfile();
      });
    }

    return () => {
      isMounted = false;
    };
  }, [auth, getAndSetUserProfile]);

  if (userProfile) {
    return (
      <DropDownMenu
        optionArray={[
          {
            text: `${userProfile.firstName} ${userProfile.lastName}`,
          },
          {
            text: "---",
          },
          {
            text: "Profile",
            icon: <UserOutlined />,
            func: () => {
              history.push(`/profile/${auth.user.uid}`);
            },
          },
          {
            text: "Sign Out",
            icon: <LogoutOutlined />,
            func: signOut,
          },
        ]}
      >
        <Avatar
          size={{ xs: 24, sm: 32, md: 36, lg: 40, xl: 40 }}
          className="navbar-avatar"
        >
          {`${userProfile.firstName[0]}${userProfile.lastName[0]}`}
        </Avatar>
      </DropDownMenu>
    );
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, {
  signOut,
})(User);
