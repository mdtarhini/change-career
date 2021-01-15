import React from "react";
import { useEffect, useState } from "react";
import Summary from "./Summary";
import ListOfPosts from "../ListOfPosts/ListOfPosts";
import { getUserProfile } from "../../firebase/users";

const Profile = ({ match }) => {
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    let isMounted = true;
    getUserProfile(match.params.id).then((snapshot) => {
      if (isMounted) {
        setUserProfile(snapshot.val());
      }
    });
    return () => {
      isMounted = false;
    };
  }, [match]);

  if (userProfile) {
    return (
      <ListOfPosts
        orderByChildKey={"authorId"}
        orderByChildValue={match.params.id}
      >
        {userProfile ? (
          <Summary userProfileId={match.params.id} userProfile={userProfile} />
        ) : null}
      </ListOfPosts>
    );
  } else {
    return null;
  }
};

export default Profile;
