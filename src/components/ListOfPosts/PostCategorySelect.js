import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import ListOfJobs from "../Common/ListOfJobs";
import { getUserProfile } from "../../firebase/users";
const { Option } = Select;
const PostCategorySelect = ({ auth, onValueChange, defaultValue }) => {
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
  }, [auth]);

  let options = [{ value: "general", label: "General" }];
  const arrow = "➡️";
  if (userProfile && userProfile.changeTo) {
    options = [
      ...options,
      {
        value: `leaving_${userProfile.changeFrom}`,
        label: `Leaving ${ListOfJobs[userProfile.changeFrom]}`,
      },
      {
        value: `joining_${userProfile.changeTo}`,
        label: `joining ${ListOfJobs[userProfile.changeTo]}`,
      },
      {
        value: `${userProfile.changeFrom}_to_${userProfile.changeTo}`,
        label: `${ListOfJobs[userProfile.changeFrom]} ${arrow} ${
          ListOfJobs[userProfile.changeTo]
        }`,
      },
    ];
  }
  return (
    <Select
      onChange={onValueChange}
      className="AddPost-select"
      defaultValue={defaultValue}
      placeholder="Select a category"
    >
      {options.map((option) => {
        return (
          <Option value={option.value} key={option.value}>
            {option.label}
          </Option>
        );
      })}
    </Select>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(PostCategorySelect);
