import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getUserProfile } from "../../firebase/users";
import { Popover } from "antd";
import ListOfJobs from "../Common/ListOfJobs";
const Author = ({ authorId }) => {
  const [author, setAuthor] = useState(null);
  useEffect(() => {
    let isMounted = true;
    if (authorId) {
      getUserProfile(authorId).then((snapshot) => {
        if (isMounted) {
          setAuthor(snapshot.val());
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [authorId]);

  const hoverInfo = () => {
    return (
      <React.Fragment>
        <p>
          {author.changeType === "seeking"
            ? "Looking for career change"
            : "Made a career change"}
        </p>
        <p>
          {ListOfJobs[author.changeFrom]}
          <ArrowRightOutlined />
          {ListOfJobs[author.changeTo]}
        </p>
      </React.Fragment>
    );
  };

  if (author) {
    if (author.changeType) {
      return (
        <Popover
          placement="right"
          title={`${author.firstName} ${author.lastName}`}
          content={hoverInfo()}
        >
          <Link
            className="author"
            to={`/profile/${authorId}`}
          >{` ${author.firstName} ${author.lastName}`}</Link>
        </Popover>
      );
    } else {
      return (
        <Link
          className="author"
          to={`/profile/${authorId}`}
        >{` ${author.firstName} ${author.lastName}`}</Link>
      );
    }
  } else {
    return null;
  }
};
export default Author;
