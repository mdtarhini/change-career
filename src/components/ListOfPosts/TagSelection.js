import React from "react";
import { Select, Tag } from "antd";
import ListOfTags from "./ListOfTags";
const { Option } = Select;

const tagRender = (props) => {
  const { value, closable, onClose } = props;

  return (
    <Tag
      color={ListOfTags[value].color}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {ListOfTags[value].label}
    </Tag>
  );
};

const TagSelection = (props) => {
  return (
    <Select
      className="tag-selection"
      defaultValue={props.defaultValue}
      mode="tags"
      placeholder="Select conveneient tags"
      tagRender={tagRender}
      onChange={props.onValuesChange}
    >
      {Object.keys(ListOfTags).map((optionKey) => {
        return (
          <Option value={optionKey} key={optionKey}>
            {ListOfTags[optionKey].label}
          </Option>
        );
      })}
    </Select>
  );
};
export default TagSelection;
