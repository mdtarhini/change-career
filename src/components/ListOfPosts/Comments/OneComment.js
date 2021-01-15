import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Comment, Space, Badge, Button, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import AddComment from "./AddComment";
import { getFormattedElpasedTime } from "../../Common/Helpers";
import { toggleCommentLike, deleteComment } from "../../../firebase/posts";
import DropDownMenu from "../../Common/DropDownMenu";
import ConfirmDelete from "../../Common/ConfirmDelete";
import EditComment from "./EditComment";
import Replies from "./Replies";
import LikeButton from "../LikeButton";
import Author from "../Author";

const { Paragraph } = Typography;
const OneComment = ({ commentData, commentId, comments, auth, location }) => {
  const [repliesVisibility, setRepliesVisibility] = useState(true);
  const [addReplyVisibility, setAddReplyVisibility] = useState(false);
  const [toEdit, setToEdit] = useState(false);

  const getHighlightedComment = () => {
    return location.search.split("?highlightedComment=")[1];
  };

  const getNumberOfReplies = () => {
    if (commentData.replies) {
      return Object.keys(commentData.replies).reduce(
        (total, currentReplyKey) =>
          total + commentData.replies[currentReplyKey],
        0
      );
    }
    return 0;
  };

  const actions = [
    <Space size={2}>
      <Space size={1}>
        <Badge
          count={commentData.likesCount}
          showZero
          className="site-badge-count-4"
        />

        <LikeButton
          onClick={() => toggleCommentLike(commentId)}
          disabled={!auth.user}
          liked={
            commentData.likers ? commentData.likers[auth.user?.uid] : false
          }
        />
      </Space>
      {getNumberOfReplies() > 0 && (
        <Button
          disabled={addReplyVisibility}
          key="comment-basic-reply-to"
          type="link"
          onClick={() => {
            setRepliesVisibility((prevState) => !prevState);
          }}
        >
          {`${repliesVisibility ? "hide" : "show"} replies`}
        </Button>
      )}
      <Button
        disabled={addReplyVisibility || !auth.user}
        key="comment-basic-reply-to"
        type="link"
        onClick={() => {
          setAddReplyVisibility(true);
        }}
      >
        Reply
      </Button>
      {auth.user?.uid === commentData.authorId && (
        <DropDownMenu
          optionArray={[
            {
              text: "Edit",
              icon: <EditOutlined />,
              func: () => {
                setToEdit(true);
              },
            },
            {
              text: "Delete",
              icon: <DeleteOutlined />,
              func: () => {
                ConfirmDelete({
                  title: "Are you sure you want to delete this comment?",
                  content:
                    "This comment and the corresponding replies will be deleted permanently",
                  onOk: () => {
                    deleteComment(commentId, commentData);
                  },
                });
              },
            },
          ]}
        ></DropDownMenu>
      )}
    </Space>,
  ];
  const renderReplies = () => {
    if (commentData.replies && comments && repliesVisibility) {
      return <Replies replies={commentData.replies} comments={comments} />;
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <EditComment
        visible={toEdit}
        onCancel={() => setToEdit(false)}
        commentBody={commentData.body}
        commentKey={commentId}
        authorId={auth.user?.uid}
      />
      <Comment
        actions={actions}
        author={<Author authorId={commentData.authorId} />}
        datetime={
          <i>{getFormattedElpasedTime(new Date(commentData.date).getTime())}</i>
        }
        content={
          <Paragraph
            className={`comment-text ${
              commentId === getHighlightedComment()
                ? " highlighted-comment-text"
                : ""
            }`}
            ellipsis={{ rows: 4, expandable: true, symbol: "...see more" }}
          >
            {commentData.body}
          </Paragraph>
        }
      >
        {addReplyVisibility && (
          <AddComment
            addCancel
            postId={commentData.postId}
            parentAuthorId={commentData.authorId}
            parentCommentId={commentId}
            onDecision={() => {
              setAddReplyVisibility(false);
            }}
          />
        )}
        {renderReplies()}
      </Comment>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(withRouter(OneComment));
