import React from "react";
import { Input, Button, Space, InputNumber, Select } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const AddOrEditPoll = ({
  options,
  time,
  onOptionChange,
  onOptionAdd,
  onOptionRemove,
  onTimeChange,
  disabled,
}) => {
  return (
    <Space className="add-poll-div" direction="vertical">
      Add options to your poll:
      {options.map((option, index) => {
        return (
          <Input
            key={index}
            placeholder={`option ${index + 1}`}
            disabled={disabled}
            className="add-poll-input"
            value={option}
            onChange={(e) => onOptionChange(e.target.value, index)}
            addonAfter={
              index > 1 ? (
                <MinusOutlined
                  className="poll-remove-option"
                  onClick={() => {
                    if (!disabled) onOptionRemove(index);
                  }}
                />
              ) : null
            }
          />
        );
      })}
      <Button
        disabled={options.length >= 10 || disabled}
        className="add-poll-add-option"
        block
        type="dashed"
        onClick={onOptionAdd}
        icon={<PlusOutlined />}
      ></Button>
      <Space>
        <span>Poll ends in </span>
        <Input.Group compact>
          <InputNumber
            className="add-poll-time-input"
            disabled={disabled}
            value={time.value}
            min={0}
            max={23}
            onChange={(value) => {
              onTimeChange("value", value);
            }}
          />
          <Select
            value={time.unit}
            disabled={disabled}
            onChange={(unit) => {
              onTimeChange("unit", unit);
            }}
          >
            <Option value="days">days</Option>
            <Option value="hours">hours</Option>
          </Select>
        </Input.Group>
      </Space>
    </Space>
  );
};

export default AddOrEditPoll;
