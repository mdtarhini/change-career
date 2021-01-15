import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Select, Card } from "antd";
import ListOfJobs from "../Common/ListOfJobs";
import { getUserProfile } from "../../firebase/users";
const { Option } = Select;
const CategoryNavigation = ({ auth, onValueChange, value }) => {
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

  let options = [
    { value: "all", label: "All" },
    { value: "general", label: "General" },
  ];
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
    <Card className="custom-card">
      <Select
        bordered={false}
        onChange={onValueChange}
        className="category-navigation-select"
        defaultValue="all"
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
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(CategoryNavigation);
