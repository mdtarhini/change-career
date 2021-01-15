import React from "react";
import { connect } from "react-redux";
import OneChatInList from "./OneChatInList";

const Chats = ({ contacts }) => {
  if (contacts) {
    return (
      <React.Fragment>
        {Object.keys(contacts)
          .sort((a, b) => {
            return (
              new Date(contacts[b].lastMsg.date) -
              new Date(contacts[a].lastMsg.date)
            );
          })
          .map((contactKey) => {
            return (
              <OneChatInList
                key={contactKey}
                contactKey={contactKey}
                lastMsg={contacts[contactKey].lastMsg}
                nUnseenMessages={contacts[contactKey].nUnseenMessages}
              />
            );
          })}
      </React.Fragment>
    );
  } else {
    return <div>nothing</div>;
  }
};
const mapStateToProps = (state) => {
  return { contacts: state.contacts };
};
export default connect(mapStateToProps)(Chats);
