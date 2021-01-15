import React from "react";
import { useState, useEffect } from "react";
import history from "../../history";
import { Card, Space, Avatar } from "antd";
import { formatDate, ellipseAText } from "../Common/Helpers";
import { BulbOutlined } from "@ant-design/icons";
import { getComment, getPost } from "../../firebase/posts";
import { getUserProfile } from "../../firebase/users";

import {
  markNotificationAsSeen,
  deleteNotification,
} from "../../firebase/notifications";
const OneNotification = ({ data, notifId }) => {
  const [author, setAuthor] = useState(null);
  const [parentContent, setParentContent] = useState(null);
  const [content, setContent] = useState(null);
  useEffect(() => {
    let isMounted = true;
    if (data && data.from) {
      getUserProfile(data.from).then((snapshot) => {
        if (isMounted) {
          setAuthor(snapshot.val());
        }
      });
      if (data.type === "comment") {
        getPost(data.on).then((snapshot) => {
          if (snapshot.val()) {
            if (isMounted) {
              setParentContent(snapshot.val());
            }
          } else {
            deleteNotification(notifId);
          }
        });
      } else if (data.type === "reply") {
        getComment(data.on).then((snapshot) => {
          if (snapshot.val()) {
            if (isMounted) {
              setParentContent(snapshot.val());
            }
          } else {
            deleteNotification(notifId);
          }
        });
      }
      if (["comment", "reply"].includes(data.type)) {
        getComment(notifId).then((snapshot) => {
          if (snapshot.val()) {
            if (isMounted) {
              setContent(snapshot.val());
            }
          } else {
            deleteNotification(notifId);
          }
        });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [data, notifId]);

  const getNotificationHeader = () => {
    const textFiller =
      data.type === "comment"
        ? "commented on your post"
        : "replied to your comment";

    return (
      <span>
        {`${author.firstName} ${author.lastName} ${textFiller} `}
        <strong>{ellipseAText(parentContent.body, 50)}</strong>
      </span>
    );
  };
  const getNotificationContent = () => {
    return <i>{ellipseAText(content.body, 50)}</i>;
  };
  const handleClick = () => {
    if (["comment", "reply"].includes(data.type)) {
      history.push(`/post/${content.postId}?highlightedComment=${notifId}`);
    }
    if (!data.seen) {
      markNotificationAsSeen(notifId);
    }
  };
  if (author && parentContent && content) {
    return (
      <Card.Grid
        className={`notification ${!data.seen ? " notification-unseen" : ""}`}
        onClick={handleClick}
      >
        <Space align="start" size="large">
          <Space direction="vertical" align="center">
            <Avatar
              className="notification-avatar"
              size={{ xs: 24, sm: 32, md: 40 }}
              icon={data.from ? null : <BulbOutlined />}
            >
              {`${author.firstName[0].toUpperCase()}${author.lastName[0].toUpperCase()}`}
            </Avatar>

            <span className="notification-time">
              {formatDate(new Date(data.date))}
            </span>
          </Space>
          <Space direction="vertical">
            {getNotificationHeader()}
            {getNotificationContent()}
          </Space>
        </Space>
      </Card.Grid>
    );
  } else {
    return (
      <Card.Grid className="invalid-notification">
        The related content for this notification was removed!
      </Card.Grid>
    );
  }
};
export default OneNotification;
