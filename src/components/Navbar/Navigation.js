import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Space, Badge } from "antd";
import { HomeFilled, MessageFilled, BellFilled } from "@ant-design/icons";

const Navigation = ({ location, notifications, contacts }) => {
  const getNumberOfUnseenNotifications = () => {
    if (notifications) {
      return Object.keys(notifications).filter(
        (notifKey) => !notifications[notifKey].seen
      ).length;
    }
    return 0;
  };
  const getNumberOfUnseenMessages = () => {
    if (contacts) {
      return Object.keys(contacts).reduce(
        (total, currentContcatKey) =>
          total + contacts[currentContcatKey].nUnseenMessages,
        0
      );
    }
    return 0;
  };
  const items = [
    { key: "/", label: "Home", icon: <HomeFilled />, badgeCount: 0 },
    {
      key: "/messaging",
      label: "Messages",
      icon: <MessageFilled />,
      badgeCount: getNumberOfUnseenMessages(),
    },
    {
      key: "/notifications",
      label: "Notifications",
      icon: <BellFilled />,
      badgeCount: getNumberOfUnseenNotifications(),
    },
  ];
  return (
    <Space size="small">
      {items.map((item) => {
        return (
          <Link to={item.key} key={item.key}>
            <span
              className={`navigation${
                item.key === location.pathname ? " navigation-selected" : ""
              }`}
            >
              <Badge count={item.badgeCount} size="small">
                <span className="icon">{item.icon}</span>
              </Badge>
            </span>
          </Link>
        );
      })}
    </Space>
  );
};

const mapStateToProps = (state) => {
  return { notifications: state.notifications, contacts: state.contacts };
};
export default connect(mapStateToProps)(withRouter(Navigation));
