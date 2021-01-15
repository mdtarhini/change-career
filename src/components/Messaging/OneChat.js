import React from "react";
import { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tooltip, Divider } from "antd";
import { formatDate } from "../Common/Helpers";
import firebase from "../../firebase/firebase";
import { markChatAsSeen } from "../../firebase/messaging";

const OneChat = (props) => {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (props.auth.user && props.selectedChat) {
      let messagesRef = firebase
        .database()
        .ref(`users-messages/${props.auth.user.uid}/${props.selectedChat}`);
      messagesRef.on("child_added", (data) => {
        setMessages((prevState) => {
          return { ...prevState, [data.key]: data.val() };
        });
      });

      return () => {
        messagesRef.off();
        setMessages(null);
      };
    }
  }, [props.auth, props.selectedChat]);

  useEffect(() => {
    if (props.selectedChat) {
      markChatAsSeen(props.selectedChat);
    }
  }, [props.selectedChat, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  const renderMessages = () => {
    if (messages) {
      let currentLastDate = "";
      let printDate = false;
      return Object.keys(messages)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((messageKey) => {
          const msg = messages[messageKey];
          if (msg.body) {
            const msgDate = new Date(msg.date);
            if (msgDate.toLocaleDateString() !== currentLastDate) {
              currentLastDate = msgDate.toLocaleDateString();
              printDate = true;
            } else {
              printDate = false;
            }

            return (
              <React.Fragment key={messageKey}>
                {printDate && (
                  <Divider
                    plain
                    className="messagesDate"
                    style={{
                      color: "transparent",
                      padding: "0px 20%",
                    }}
                  >
                    <span>{currentLastDate}</span>
                  </Divider>
                )}
                <Tooltip
                  mouseEnterDelay={0.4}
                  placement={msg.sent ? "left" : "right"}
                  title={formatDate(msgDate)}
                  overlayClassName="messageTooltip"
                >
                  <div
                    className={
                      msg.sent ? "message from-me" : "message from-them"
                    }
                  >
                    <span>{msg.body}</span>
                  </div>
                </Tooltip>

                <div className="break"></div>
              </React.Fragment>
            );
          } else {
            return null;
          }
        });
    }
  };
  return (
    <div className="one-chat-div">
      {renderMessages()}
      {!props.selectedChat && (
        <div className="no-chat-selected">Please select a conversation</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth, selectedChat: state.selectedChat };
};
export default connect(mapStateToProps)(OneChat);
