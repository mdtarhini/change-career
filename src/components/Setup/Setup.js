import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import EditProfileForm from "./EditProfileForm";
import { getUserProfile } from "../../firebase/users";
const Setup = ({ match, auth }) => {
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    let isMounted = true;
    if (auth.user) {
      getUserProfile(auth.user.uid).then((snapshot) => {
        if (isMounted) {
          setUserProfile(snapshot.val());
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [match, auth]);

  if (userProfile) {
    return (
      <div className="setup-div">
        <EditProfileForm
          initialValues={{
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            country: userProfile.country ? userProfile.country : null,
            bio: userProfile.bio ? userProfile.bio : null,
            changeType: userProfile.changeType ? userProfile.changeType : null,
            changeDate: userProfile.changeDate
              ? moment(userProfile.changeDate, "YYYY-MM")
              : null,
            changeFrom: userProfile.changeFrom ? userProfile.changeFrom : null,
            changeTo: userProfile.changeTo ? userProfile.changeTo : null,
            experiences: userProfile.experiences
              ? userProfile.experiences.map((exp) => {
                  return {
                    ...exp,
                    whenStart: moment(exp.whenStart, "YYYY-MM"),
                    whenEnd:
                      exp.whenEnd === "present"
                        ? null
                        : moment(exp.whenEnd, "YYYY-MM"),
                    whenEndIspresent: exp.whenEnd === "present",
                  };
                })
              : null,
          }}
          firstEdit={match.params.editOrSetup === "firstSetup"}
        />
      </div>
    );
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Setup);
