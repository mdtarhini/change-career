import React from "react";
import { useState } from "react";
import { Card, Space, Divider, Input, Button, Row, Col, Alert } from "antd";
import TagSelection from "./TagSelection";
import AddOrEditPoll from "./AddOrEditPoll";
import PostCategorySelect from "./PostCategorySelect";
import { pushPost, updatePost } from "../../firebase/posts";
const { TextArea } = Input;

const AddOrEditPost = (props) => {
  let initialState = {
    body: "",
    category: null,
    withPoll: false,
    pollOptions: ["", ""],
    pollTime: { unit: "days", value: 1 },
    tags: [],
    errorMessage: null,
  };
  if (props.initialValues) {
    initialState = {
      body: props.initialValues.body,
      category: props.initialValues.category,

      withPoll: props.initialValues.pollOptions,
      pollOptions: props.initialValues.pollOptions
        ? props.initialValues.pollOptions.map((option) => option.value)
        : ["", ""],
      pollTime: props.initialValues.pollTime,
      tags: props.initialValues.tags ? props.initialValues.tags : [],
      errorMessage: null,
    };
  }

  const [postState, setPostState] = useState(initialState);

  const updateState = (updatedPart) => {
    setPostState((prevState) => {
      return {
        ...prevState,
        ...updatedPart,
      };
    });
  };
  const getPollExpirationTime = () => {
    const date = new Date();
    return (
      date.getTime() +
      postState.pollTime.value *
        (postState.pollTime.unit === "hours" ? 1000 * 3600 : 1000 * 3600 * 24)
    );
  };

  const onFinish = () => {
    //required fields:
    if (!postState.category) {
      updateState({ errorMessage: "Please select a category for your post" });
      return;
    } else if (
      postState.withPoll &&
      (!postState.pollOptions[0] || !postState.pollOptions[1])
    ) {
      updateState({
        errorMessage: "At least two options should be provided in the poll",
      });
      return;
    }

    let postData = {
      body: postState.body,
      category: postState.category,
      tags: postState.tags,
    };

    //Edit and save
    if (props.initialValues) {
      updatePost(props.postId, props.initialValues.authorId, postData).then(
        () => {
          props.onCancel();
        }
      );
    }
    //First push
    else {
      postData = { ...postData, likesCount: 0, commentsCount: 0 };
      if (postState.withPoll) {
        postData.pollOptions = postState.pollOptions.map((option) => {
          return { value: option, votes: 0 };
        });
        postData.pollTime = getPollExpirationTime();
        postData.pollVoters = ["none"];
      }
      pushPost(postData).then(() => {
        props.onCancel();
      });
    }
  };

  // poll settings and functions
  const togglePoll = () => {
    updateState({ withPoll: !postState.withPoll, errorMessage: null });
  };

  const changePollOption = (value, index) => {
    let pollOptions = postState.pollOptions;
    pollOptions[index] = value;
    updateState({ pollOptions, errorMessage: null });
  };
  const addPollOption = () => {
    let pollOptions = postState.pollOptions;
    pollOptions.push("");
    updateState({ pollOptions, errorMessage: null });
  };
  const removePollOption = (index) => {
    let pollOptions = postState.pollOptions;
    pollOptions.splice(index, 1);
    updateState({ pollOptions, errorMessage: null });
  };
  const changePollTime = (key, newValue) => {
    let pollTime = postState.pollTime;
    pollTime[key] = newValue;
    updateState({ pollTime, errorMessage: null });
  };
  const onTextChange = (body) => {
    updateState({ body, errorMessage: null });
  };

  return (
    <div className="custom-card">
      <Card>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={12} lg={8}>
            <PostCategorySelect
              defaultValue={postState.category}
              onValueChange={(value) => updateState({ category: value })}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <TagSelection
              defaultValue={postState.tags}
              onValuesChange={(values) => updateState({ tags: values })}
            />
          </Col>
        </Row>

        <Divider />
        <TextArea
          bordered={false}
          rows={4}
          autoSize={{ minRows: 2, maxRows: 10 }}
          placeholder="Type your post here..."
          allowClear
          value={postState.body}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <Divider />
        {postState.withPoll && (
          <AddOrEditPoll
            disabled={
              props.initialValues ? props.initialValues.pollOptions : false
            }
            options={postState.pollOptions}
            time={postState.pollTime}
            onOptionChange={changePollOption}
            onOptionAdd={addPollOption}
            onOptionRemove={removePollOption}
            onTimeChange={changePollTime}
          />
        )}
        <Row justify="space-between">
          <Col>
            <Button
              onClick={togglePoll}
              danger={postState.withPoll}
              disabled={props.initialValues}
            >
              {postState.withPoll ? "remove poll" : "add poll"}
            </Button>
          </Col>

          <Col>
            <Space>
              <Button
                type="primary"
                disabled={!postState.body}
                onClick={onFinish}
              >
                {props.initialValues ? "Save" : "Add"}
              </Button>
              <Button type="primary" danger onClick={props.onCancel}>
                Cancel
              </Button>
            </Space>
          </Col>
        </Row>
        {postState.errorMessage && (
          <Alert
            type="error"
            message={postState.errorMessage}
            showIcon
            className="add-or-edit-post-error"
          />
        )}
      </Card>
    </div>
  );
};
export default AddOrEditPost;
