import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Space, Avatar, Divider } from "antd";
import { UserOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { selectChat } from "../../actions/messaging";
import { getUserProfile } from "../../firebase/users";

const ContactInfo = (props) => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getUserProfile(props.selectedChat).then((snapshot) => {
      if (isMounted) {
        setContact(snapshot.val());
      }
    });

    return () => {
      isMounted = false;
    };
  }, [props.selectedChat]);

  const getContactInfo = () => {
    if (contact) {
      return (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>{`${contact.firstName} ${contact.lastName}`}</span>
        </Space>
      );
    }
    return null;
  };
  return (
    <div className="message-contact-info-div">
      <Space>
        <LeftCircleOutlined onClick={() => props.selectChat(null)} />
        <Divider type="vertical" />
        {getContactInfo()}
      </Space>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { contacts: state.contacts, selectedChat: state.selectedChat };
};
export default connect(mapStateToProps, { selectChat })(ContactInfo);
