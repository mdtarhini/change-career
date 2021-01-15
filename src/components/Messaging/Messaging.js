import React from "react";

import Chats from "./Chats";
import OneChat from "./OneChat";
import ChatInput from "./ChatInput";
import ContactInfo from "./ContactInfo";
import { connect } from "react-redux";
import EmptyDiv from "./EmptyDiv";

const Messaging = ({ smallScreen, selectedChat, contacts }) => {
  const siderVisibility = (smallScreen && !selectedChat) || !smallScreen;
  const Layout = () => {
    return (
      <div className="messaging-div">
        {siderVisibility && (
          <div className={`chats-div ${smallScreen ? " chats-div-small" : ""}`}>
            <Chats />
          </div>
        )}
        <div
          className={`messaging-right ${
            smallScreen ? " messaging-right-small" : ""
          }`}
        >
          {smallScreen && <ContactInfo />}

          <div
            className={
              smallScreen ? "one-chat-wrapper-small" : "one-chat-wrapper"
            }
          >
            <OneChat />
          </div>
          {selectedChat && <ChatInput />}
        </div>
      </div>
    );
  };
  if (!contacts) {
    return <EmptyDiv text="loading..." />;
  } else if (Object.keys(contacts).length === 0) {
    return <EmptyDiv text="You do not have any chat with contacts yet!" />;
  } else {
    return Layout();
  }
};
const mapStateToProps = (state) => {
  return {
    smallScreen: state.smallScreen,
    selectedChat: state.selectedChat,
    contacts: state.contacts,
  };
};
export default connect(mapStateToProps)(Messaging);
