import React from "react";
// import Summary from "./Summary";
import ListOfPosts from "../ListOfPosts/ListOfPosts";

const Job = (props) => {
  const postFilter = (category) => {
    if (category.indexOf("_") === -1) {
      return false;
    } else if (category.includes("leaving") || category.includes("joining")) {
      return category.split("_")[1] === props.match.params.jobId;
    } else {
      return (
        category.split("_to_")[0] === props.match.params.jobId ||
        category.split("_to_")[1] === props.match.params.jobId
      );
    }
  };
  return (
    <ListOfPosts
      orderByChildKey="date"
      clientFilterKey="category"
      clientFlterFunction={(category) => postFilter(category)}
      numberOfPullsAtATime={50}
    >
      {/* {<Summary jobId={match.params.jobId} />} */}
    </ListOfPosts>
  );
};

export default Job;
