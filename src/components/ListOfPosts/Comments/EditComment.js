import React from "react";
import { useState } from "react";
import { Modal, Input } from "antd";
import { updateComment } from "../../../firebase/posts";
const { TextArea } = Input;

const EditComment = (props) => {
  const [loading, setLoading] = useState(false);
  const [commentBody, setCommentBody] = useState(props.commentBody);
  const handleOk = () => {
    setLoading(true);
    updateComment(props.commentKey, props.authorId, commentBody).then(() => {
      props.onCancel();
      setLoading(false);
    });
  };

  return (
    <Modal
      title="Edit your comment:"
      visible={props.visible}
      onOk={handleOk}
      okText="Save"
      confirmLoading={loading}
      onCancel={props.onCancel}
      okButtonProps={commentBody ? {} : { disabled: true }}
    >
      <TextArea
        rows={4}
        autoSize={{ minRows: 2, maxRows: 10 }}
        placeholder="Add comment"
        allowClear
        autoFocus
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
      />
    </Modal>
  );
};
export default EditComment;
