import React from "react";
import { Spin, Card } from "antd";

import { connect } from "react-redux";
import OneNotification from "./OneNotification";

const Notifications = ({ notifications }) => {
  const renderNotifications = () => {
    return Object.keys(notifications)
      .sort((notifKeyA, notifKeyB) => {
        return (
          new Date(notifications[notifKeyB].date) -
          new Date(notifications[notifKeyA].date)
        );
      })
      .map((notifKey) => {
        return (
          <OneNotification
            key={notifKey}
            data={notifications[notifKey]}
            notifId={notifKey}
          />
        );
      });
  };

  return (
    <div className="list-of-notifications">
      <div className="custom-card notifications-card">
        {notifications ? (
          renderNotifications().length > 0 ? (
            renderNotifications()
          ) : (
            <Card.Grid className="invalid-notification">
              No notifications!
            </Card.Grid>
          )
        ) : (
          <Spin />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { notifications: state.notifications };
};
export default connect(mapStateToProps)(Notifications);
