import React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import OnePost from "../ListOfPosts/OnePost";
import { setExpandedPost } from "../../actions/post";
import firebase from "../../firebase/firebase";

const Post = ({ match, setExpandedPost, location }) => {
  const [postData, setPostData] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const postRef = firebase.database().ref("posts/" + match.params.postId);
    postRef.on("value", (snapshot) => {
      if (isMounted) {
        setPostData(snapshot.val());
      }
    });
    setExpandedPost(match.params.postId);
    return () => {
      isMounted = false;
      postRef.off();
    };
  }, [match, setExpandedPost]);

  if (postData) {
    return (
      <div className="list-of-posts">
        <OnePost postData={postData} postId={match.params.postId} />
      </div>
    );
  } else {
    return null;
  }
};

export default connect(null, { setExpandedPost })(Post);
