import React from "react";
import { useState } from "react";
import { Card, Space, Divider, Tag, Col, Row, Badge, Button } from "antd";
import {
  ArrowRightOutlined,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import DropDownMenu from "../Common/DropDownMenu";
import Comments from "./Comments/Comments";
import Poll from "./Poll";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { voteOnPoll, togglePostLike, deletePost } from "../../firebase/posts";
import { setExpandedPost } from "../../actions/post";
import { getFormattedElpasedTime } from "../Common/Helpers";
import ListOfJobs from "../Common/ListOfJobs";
import ListOfTags from "./ListOfTags";
import AddOrEditPost from "./AddOrEditPost";
import ConfirmDelete from "../Common/ConfirmDelete";
import LikeButton from "./LikeButton";
import Author from "./Author";
const { Paragraph } = Typography;

const OnePost = (props) => {
  const { postData } = props;

  const [toEdit, setToEdit] = useState(false);

  const renderPostCategory = () => {
    if (postData.category.indexOf("_") === -1) {
      return <span>General</span>;
    } else if (postData.category.includes("leaving")) {
      return (
        <Space>
          <Link to={`/job/${postData.category.split("_")[1]}`}>
            <span>{ListOfJobs[postData.category.split("_")[1]]}</span>
          </Link>
          <ArrowRightOutlined />
        </Space>
      );
    } else if (postData.category.includes("joining")) {
      return (
        <Space>
          <ArrowRightOutlined />
          <Link to={`/job/${postData.category.split("_")[1]}`}>
            <span>{ListOfJobs[postData.category.split("_")[1]]}</span>
          </Link>
        </Space>
      );
    } else {
      return (
        <Space>
          <Link to={`/job/${postData.category.split("_to_")[0]}`}>
            <span>{ListOfJobs[postData.category.split("_to_")[0]]}</span>
          </Link>
          <ArrowRightOutlined />
          <Link to={`/job/${postData.category.split("_to_")[1]}`}>
            <span>{ListOfJobs[postData.category.split("_to_")[1]]}</span>
          </Link>
        </Space>
      );
    }
  };

  const toggleComments = () => {
    if (props.expandedPost === props.postId) {
      props.setExpandedPost(null);
    } else {
      props.setExpandedPost(props.postId);
    }
  };
  const DisplayPost = () => {
    return (
      <div className="custom-card">
        <Card
          actions={[
            <Space key="like">
              <Badge
                showZero
                count={postData.likesCount}
                className="site-badge-count-4"
              />
              <LikeButton
                onClick={() => togglePostLike(props.postId)}
                disabled={!props.auth.user}
                liked={
                  postData.likers
                    ? postData.likers[props.auth.user?.uid]
                    : false
                }
              />
            </Space>,
            <Space key="comment" onClick={toggleComments}>
              <Badge
                showZero
                count={postData.commentsCount}
                className="site-badge-count-4"
              />
              <Button className="like-button" type="text">
                <CommentOutlined />
              </Button>
            </Space>,
          ]}
        >
          <Row justify="space-between">
            <Col>
              <Space className="post-header">{renderPostCategory()}</Space>
            </Col>
            {props.auth.user?.uid === postData.authorId && (
              <Col>
                <DropDownMenu
                  optionArray={[
                    {
                      text: "Edit",
                      icon: <EditOutlined />,
                      func: () => {
                        setToEdit(true);
                      },
                    },
                    {
                      text: "Delete",
                      icon: <DeleteOutlined />,
                      func: () => {
                        ConfirmDelete({
                          title: "Are you sure you want to delete this post?",
                          content:
                            "This post and the corresponding comments will be deleted permanently",
                          onOk: () => {
                            deletePost(props.postId, postData.authorId);
                          },
                        });
                      },
                    },
                  ]}
                ></DropDownMenu>
              </Col>
            )}
          </Row>
          <Space direction="vertical">
            <span className="post-author">
              posted by {<Author authorId={postData.authorId} />}
            </span>

            <Space>
              <i className="post-time">
                {getFormattedElpasedTime(new Date(postData.date).getTime())}
              </i>
              {postData.tags &&
                postData.tags.map((tag) => {
                  return (
                    <Tag key={tag} color={ListOfTags[tag].color}>
                      {ListOfTags[tag].label}
                    </Tag>
                  );
                })}
            </Space>
          </Space>

          <Divider />
          <Paragraph
            ellipsis={{
              rows: 6,
              expandable: true,
              symbol: "...continue reading",
            }}
          >
            {postData.body}
          </Paragraph>

          {postData.pollOptions && (
            <Poll
              disabled={!props.auth.user}
              options={postData.pollOptions}
              showResult={
                postData.pollVoters.includes(props.auth.user?.uid) ||
                postData.pollTime < Date.now()
              }
              pollTime={postData.pollTime}
              onVoting={voteOnPoll}
              postId={props.postId}
            />
          )}
        </Card>
        {props.expandedPost === props.postId && (
          <Comments postId={props.postId} postAuthorId={postData.authorId} />
        )}
      </div>
    );
  };
  if (postData) {
    if (toEdit) {
      return (
        <AddOrEditPost
          onCancel={() => setToEdit(false)}
          initialValues={postData}
          postId={props.postId}
        />
      );
    } else {
      return DisplayPost();
    }
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return { auth: state.auth, expandedPost: state.expandedPost };
};
export default connect(mapStateToProps, { setExpandedPost })(OnePost);
