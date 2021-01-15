import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Space, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ellipseAText, formatDate } from "../Common/Helpers";
import { getUserProfile } from "../../firebase/users";
import { selectChat } from "../../actions/messaging";
const OneChatInList = (props) => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getUserProfile(props.contactKey).then((snapshot) => {
      if (isMounted) {
        setContact(snapshot.val());
      }
    });

    return () => {
      isMounted = false;
    };
  }, [props.contactKey]);

  const onChatClicked = () => {
    props.selectChat(props.contactKey);
    // markChatAsSeen(props.selectedChat);
  };
  if (contact) {
    return (
      <div
        className={`chat-in-list${
          props.selectedChat === props.contactKey ? " selected" : ""
        }`}
        onClick={onChatClicked}
      >
        <Row justify="space-between">
          <Col>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Space direction="vertical" size={2}>
                <span className="chat-in-list-name">
                  {ellipseAText(contact.firstName, 16)}
                </span>
                {props.lastMsg.body && (
                  <span>{ellipseAText(props.lastMsg.body, 12)}</span>
                )}
              </Space>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size={2} style={{ textAlign: "right" }}>
              {props.lastMsg.body && (
                <span style={{ fontSize: "small" }}>
                  {formatDate(new Date(props.lastMsg.date))}
                </span>
              )}
              <Badge count={props.nUnseenMessages} size="small" />
            </Space>
          </Col>
        </Row>
      </div>
    );
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return {
    selectedChat: state.selectedChat,
  };
};
export default connect(mapStateToProps, { selectChat })(OneChatInList);
