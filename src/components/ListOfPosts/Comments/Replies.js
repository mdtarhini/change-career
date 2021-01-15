import React from "react";
import { connect } from "react-redux";
import OneComment from "./OneComment";

const Replies = ({ auth, comments, replies }) => {
  if (replies && comments) {
    return (
      <div className="replies-div">
        {Object.keys(replies).map((replyId) => {
          if (comments[replyId]) {
            return (
              <OneComment
                comments={comments}
                key={replyId}
                auth={auth}
                commentId={replyId}
                commentData={comments[replyId]}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Replies);
