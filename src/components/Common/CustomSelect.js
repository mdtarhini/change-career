import React from "react";
import { Select } from "antd";

const { Option } = Select;
const CustomSelect = (props) => {
  return (
    <Select
      defaultValue={props.defaultValue}
      onChange={props.handleChange}
      className={props.className}
    >
      {props.options.map((option) => {
        return (
          <Option value={option.value} key={option.value}>
            {option.label}
          </Option>
        );
      })}
    </Select>
  );
};
export default CustomSelect;
