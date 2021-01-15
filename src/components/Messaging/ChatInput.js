import React from "react";
import { useState } from "react";
import { Input } from "antd";
import { connect } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { sendMessage } from "../../firebase/messaging";
const { TextArea } = Input;

const ChatInput = (props) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    if (value) {
      sendMessage(props.selectedChat, { body: value, date: new Date() });
      setValue("");
    }
  };

  return (
    <div className="chat-input-div">
      <TextArea
        className="chat-input"
        disabled={!props.auth.user}
        value={value}
        autoFocus
        onChange={onChange}
        placeholder="Write a message..."
        autoSize={{ minRows: 1, maxRows: 5 }}
        onPressEnter={(e) => {
          e.preventDefault();
          onClick();
        }}
      ></TextArea>
      <Button type="primary" shape="circle" onClick={onClick} disabled={!value}>
        <SendOutlined />
      </Button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    selectedChat: state.selectedChat,
  };
};
export default connect(mapStateToProps)(ChatInput);
