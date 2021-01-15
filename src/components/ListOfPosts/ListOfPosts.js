import React from "react";
import { useRef, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CreatePostButton from "./CreatePostButton";
import OnePost from "./OnePost";
import AddOrEditPost from "./AddOrEditPost";
import firebase from "../../firebase/firebase";
import { cancelNewPost } from "../../actions/post";
import { Empty } from "antd";
import _ from "lodash";
const ListOfPosts = (props) => {
  const {
    orderByChildKey,
    orderByChildValue,
    clientFilterKey,
    clientFlterFunction,
    numberOfPullsAtATime,
  } = props;

  const homeDivRef = useRef(null);

  const [maxNumberOfPosts, setMaxNumberOfPosts] = useState(
    numberOfPullsAtATime ? numberOfPullsAtATime : 5
  );
  const [posts, setPosts] = useState(null);
  const addOneToPosts = (postKey, postData) => {
    setPosts((prevState) => {
      return { ...prevState, [postKey]: postData };
    });
  };
  const deleteOneFromPosts = (postKey) => {
    setPosts((prevState) => {
      return _.omit(prevState, postKey);
    });
  };

  useEffect(() => {
    let postRef;

    if (orderByChildValue) {
      postRef = firebase
        .database()
        .ref("posts/")
        .orderByChild(orderByChildKey)
        .equalTo(orderByChildValue)
        .limitToLast(maxNumberOfPosts);
    } else {
      postRef = firebase
        .database()
        .ref("posts/")
        .orderByChild(orderByChildKey)
        .limitToLast(maxNumberOfPosts);
    }

    postRef.on("child_added", (data) => {
      if (clientFilterKey) {
        if (clientFlterFunction(data.val()[clientFilterKey])) {
          addOneToPosts(data.key, data.val());
        }
      } else {
        addOneToPosts(data.key, data.val());
      }
    });
    postRef.on("child_changed", (data) => {
      addOneToPosts(data.key, data.val());
    });
    postRef.on("child_removed", (data) => {
      deleteOneFromPosts(data.key);
    });
    return () => {
      postRef.off();
    };
  }, [
    maxNumberOfPosts,
    clientFilterKey,
    clientFlterFunction,
    orderByChildKey,
    orderByChildValue,
  ]);

  useEffect(() => {
    setPosts(null);
  }, [orderByChildKey, orderByChildValue]);

  const scrollToTop = () => {
    homeDivRef.current.scrollTo(0, 0);
  };
  const handleScroll = (e) => {
    const isBottomReached =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (isBottomReached && Object.keys(posts).length % 5 === 0) {
      setMaxNumberOfPosts(
        (prevSttate) =>
          prevSttate + (numberOfPullsAtATime ? numberOfPullsAtATime : 5)
      );
    }
  };
  return (
    <div className="list-of-posts" ref={homeDivRef} onScroll={handleScroll}>
      {props.children}
      {props.newPostVisibility && props.location.pathname === "/" && (
        <AddOrEditPost onCancel={props.cancelNewPost} />
      )}

      {posts ? (
        Object.keys(posts)
          .sort(
            (postKeyA, postKeyB) =>
              new Date(posts[postKeyB].date) - new Date(posts[postKeyA].date)
          )
          .map((postKey, index) => {
            return (
              <OnePost postData={posts[postKey]} postId={postKey} key={index} />
            );
          })
      ) : (
        <Empty description="No posts" />
      )}

      {props.withAddButton && <CreatePostButton onClickExtra={scrollToTop} />}
      <hr />
    </div>
  );
};
const mapStateToProps = (state) => {
  return { newPostVisibility: state.newPostVisibility };
};
export default connect(mapStateToProps, {
  cancelNewPost,
})(withRouter(ListOfPosts));
