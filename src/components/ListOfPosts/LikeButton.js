import React from "react";
import { Button } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

const LikeButton = (props) => {
  return (
    <Button
      type="text"
      disabled={props.disabled}
      onClick={props.onClick}
      className={`like-button ${props.liked ? "like-button-liked" : ""}`}
    >
      {props.liked ? <LikeFilled /> : <LikeOutlined />}
    </Button>
  );
};
export default LikeButton;
