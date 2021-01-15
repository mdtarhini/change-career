import { Radio } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { List, Divider, Card } from "antd";
import OneComment from "./OneComment";
import AddComment from "./AddComment";
import firebase from "../../../firebase/firebase";
import _ from "lodash";
const Comments = (props) => {
  const { postId } = props;
  const [orderCommentsBy, setOrderCommentsBy] = useState("mostLiked");
  const [comments, setComments] = useState(null);
  const addOneToComments = (commentKey, commentData) => {
    setComments((prevState) => {
      return { ...prevState, [commentKey]: commentData };
    });
  };
  const deleteOneFromComments = (commentKey) => {
    setComments((prevState) => {
      return _.omit(prevState, commentKey);
    });
  };

  useEffect(() => {
    const commentsRef = firebase
      .database()
      .ref("comments/")
      .orderByChild("postId")
      .equalTo(postId);
    commentsRef.on("child_added", (data) => {
      addOneToComments(data.key, data.val());
    });
    commentsRef.on("child_changed", (data) => {
      addOneToComments(data.key, data.val());
    });
    commentsRef.on("child_removed", (data) => {
      deleteOneFromComments(data.key);
    });
    return () => {
      commentsRef.off();
      setComments(null);
    };
  }, [postId]);
  const header = (
    <div className="comments-header">
      <Radio.Group
        value={orderCommentsBy}
        buttonStyle="solid"
        size="small"
        onChange={(e) => setOrderCommentsBy(e.target.value)}
      >
        <Radio.Button value="mostLiked">Most liked</Radio.Button>
        <Radio.Button value="newest">Newest</Radio.Button>
        <Radio.Button value="oldest">Oldest</Radio.Button>
      </Radio.Group>
    </div>
  );
  const renderListOfComments = () => {
    if (comments) {
      return Object.keys(comments)
        .filter(
          (commentId) => !comments[commentId].hasOwnProperty("parentCommentId")
        )
        .sort((commentA, commentB) => {
          if (orderCommentsBy === "mostLiked") {
            return (
              comments[commentB].likesCount - comments[commentA].likesCount
            );
          } else if (orderCommentsBy === "newest") {
            return (
              new Date(comments[commentB].date) -
              new Date(comments[commentA].date)
            );
          } else if (orderCommentsBy === "oldest") {
            return (
              new Date(comments[commentA].date) -
              new Date(comments[commentB].date)
            );
          } else {
            return 1;
          }
        })
        .map((commentId) => {
          return (
            <li key={commentId}>
              <React.Fragment>
                <OneComment
                  commentId={commentId}
                  commentData={comments[commentId]}
                  comments={comments}
                />
                <Divider className="comments-divider" />
              </React.Fragment>
            </li>
          );
        });
    } else {
      return null;
    }
  };
  return (
    <Card className="comment-list">
      <List itemLayout="horizontal">
        <li>{header}</li>
        <li>
          <AddComment
            postId={props.postId}
            parentAuthorId={props.postAuthorId}
          />
        </li>

        {renderListOfComments()}
      </List>
    </Card>
  );
};

export default Comments;
