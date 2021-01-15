import firebase from "./firebase";
const database = firebase.database();

export const pushPost = (postData) => {
  const date = new Date();

  const userId = firebase.auth().currentUser.uid;
  //   const userId = "5soNlVfXYJVLKWUOWxKIB4C1nWM2";

  postData["authorId"] = userId;
  postData["date"] = date;
  const newPostKey = database.ref().child("posts").push().key;

  const updates = {};
  updates["/posts/" + newPostKey] = postData;
  return database.ref().update(updates);
};

export const pushNotification = (userId, notifData) => {
  const date = new Date();
  notifData["date"] = date;
  const newNotifKey = database.ref().child("users-notifications").push().key;
  const updates = {};
  updates["/users-notifications/" + newNotifKey] = notifData;
  return database.ref().update(updates);
};

export const updatePost = (postKey, authorId, postData) => {
  const userId = firebase.auth().currentUser.uid;
  if (authorId === userId) {
    const postRef = database.ref(`/posts/${postKey}`);
    return postRef.update({ ...postData });
  }
  return Promise.resolve();
};

const deletePostComments = (postKey) => {
  const commentsRef = database
    .ref("/comments/")
    .orderByChild("postId")
    .equalTo(postKey);

  commentsRef.once("value", (snapshot) => {
    var updates = {};
    snapshot.forEach(function (child) {
      updates["/comments/" + child.key] = null;
    });
    database.ref().update(updates);
  });
};
export const deletePost = (postKey, authorId) => {
  const userId = firebase.auth().currentUser.uid;
  if (authorId === userId) {
    const postRef = database.ref(`/posts/${postKey}`);
    //remove all the comments associated to this post:
    deletePostComments(postKey);
    return postRef.remove();
  }
  return Promise.resolve();
};
export const updateCommentsCountForPost = (postId, incrementBy) => {
  database.ref(`/posts/${postId}`).transaction((post) => {
    if (post) {
      post.commentsCount += incrementBy;
    }
    return post;
  });
};

export const addReplyToComment = (commentId, replyId) => {
  database.ref(`/comments/${commentId}`).transaction((comment) => {
    if (comment) {
      if (!comment.replies) {
        comment.replies = {};
      }
      comment.replies[replyId] = true;
    }
    return comment;
  });
};

const removeReplyFromComment = (commentId, replyId) => {
  database.ref(`/comments/${commentId}`).transaction((comment) => {
    if (comment) {
      comment.replies[replyId] = false;
    }
    return comment;
  });
};

export const pushComment = (
  commentData,
  parentPostId = null,
  parentCommentId = null,
  parentAuthorId
) => {
  const date = new Date();

  const userId = firebase.auth().currentUser.uid;

  commentData["authorId"] = userId;
  commentData["date"] = date;
  commentData["postId"] = parentPostId;
  if (parentCommentId) {
    commentData["parentCommentId"] = parentCommentId;
  }

  const newCommentKey = firebase.database().ref().child("comments").push().key;
  if (parentCommentId) {
    addReplyToComment(parentCommentId, newCommentKey);
  } else {
    //only incremen the number of comments on post if the comment is direct
    updateCommentsCountForPost(parentPostId, 1);
  }

  const updates = {};
  updates["/comments/" + newCommentKey] = commentData;
  if (userId !== parentAuthorId) {
    updates[`/users-notifications/${parentAuthorId}/${newCommentKey}`] = {
      type: parentCommentId ? "reply" : "comment",
      on: parentCommentId ? parentCommentId : parentPostId,
      from: userId,
      date: date,
      seen: false,
    };
  }

  return database.ref().update(updates);
};

export const updateComment = (commentKey, authorId, commentBody) => {
  const userId = firebase.auth().currentUser.uid;
  if (authorId === userId) {
    const commentRef = database.ref(`/comments/${commentKey}`);
    return commentRef.update({ body: commentBody });
  }
  return Promise.resolve();
};

export const deleteComment = (commentKey, commentData) => {
  const userId = firebase.auth().currentUser.uid;
  if (commentData.authorId === userId) {
    //remember to decrement the comments count of the parent post (if the comment is first child)

    const commentRef = database.ref(`/comments/${commentKey}`);
    return commentRef.remove().then(() => {
      if (!commentData.parentCommentId) {
        updateCommentsCountForPost(commentData.postId, -1);
      } else {
        removeReplyFromComment(commentData.parentCommentId, commentKey);
      }
      //delete the replies:
      if (commentData.replies) {
        Object.keys(commentData.replies).forEach((replyId) => {
          if (commentData.replies[replyId]) {
            getComment(replyId).then((snapshot) => {
              deleteComment(replyId, snapshot.val());
            });
          }
        });
      }
    });
  }
  return Promise.resolve();
};

export const voteOnPoll = (postId, votedOption) => {
  const userId = firebase.auth().currentUser.uid;

  database.ref(`/posts/${postId}`).transaction((post) => {
    if (post) {
      if (post.pollOptions) {
        post.pollOptions[votedOption].votes++;
        post.pollVoters.push(userId);
      }
    }

    return post;
  });
};

export const togglePostLike = (postId) => {
  const userId = firebase.auth().currentUser.uid;

  database.ref(`/posts/${postId}`).transaction((post) => {
    if (post) {
      if (post.likers && post.likers[userId]) {
        post.likesCount--;
        post.likers[userId] = null;
      } else {
        post.likesCount++;
        if (!post.likers) {
          post.likers = {};
        }
        post.likers[userId] = true;
      }
    }
    return post;
  });
};
export const toggleCommentLike = (commentId) => {
  const userId = firebase.auth().currentUser.uid;

  database.ref(`/comments/${commentId}`).transaction((comment) => {
    if (comment) {
      if (comment.likers && comment.likers[userId]) {
        comment.likesCount--;
        comment.likers[userId] = null;
      } else {
        comment.likesCount++;
        if (!comment.likers) {
          comment.likers = {};
        }
        comment.likers[userId] = true;
      }
    }
    return comment;
  });
};

export const getComment = (commentId) => {
  return database.ref("/comments/" + commentId).once("value");
};
export const getPost = (postId) => {
  return database.ref("/posts/" + postId).once("value");
};
