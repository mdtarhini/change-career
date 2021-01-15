import React from "react";
import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { initNewPost } from "../../actions/post";
import { connect } from "react-redux";
const CreatePostButton = (props) => {
  const theButton = () => {
    return (
      <Button
        disabled={props.newPostVisibility || !props.auth.user}
        className="createPost"
        type="primary"
        shape="circle"
        onClick={() => {
          props.initNewPost();
          props.onClickExtra();
        }}
      >
        <PlusOutlined />
      </Button>
    );
  };
  if (!props.auth.user) {
    return <Tooltip title="Sign in to create posts!">{theButton()}</Tooltip>;
  } else {
    return theButton();
  }
};
const mapStateToProps = (state) => {
  return { newPostVisibility: state.newPostVisibility, auth: state.auth };
};
export default connect(mapStateToProps, { initNewPost })(CreatePostButton);
