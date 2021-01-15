import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Input, Button, Space } from "antd";
import { pushComment } from "../../../firebase/posts";
const { TextArea } = Input;
const AddComment = (props) => {
  const [value, setValue] = useState("");

  const handleCancel = () => {
    if (props.onDecision) {
      props.onDecision();
    }
  };

  const handlePost = () => {
    if (props.onDecision) {
      props.onDecision();
    }
    pushComment(
      { body: value, likesCount: 0 },
      props.postId,
      props.parentCommentId ? props.parentCommentId : null,
      props.parentAuthorId
    );
    setValue("");
  };

  return (
    <Space direction="vertical" className="add-comment">
      <TextArea
        disabled={!props.auth.user}
        rows={4}
        autoSize={{ minRows: 2, maxRows: 10 }}
        placeholder={
          props.auth.user ? "Add comment" : "Sign in to add comments"
        }
        allowClear
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Space>
        {value !== "" && <Button onClick={handlePost}>Post</Button>}
        {props.addCancel && (
          <Button danger onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </Space>
    </Space>
  );
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(AddComment);
