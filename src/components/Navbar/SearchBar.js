import React from "react";
import { useState } from "react";
// import { connect } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import { Input } from "antd";

const SearchBar = (props) => {
  const [fullWidth, setFullWidth] = useState(false);
  // const onSearch = () => {};
  return (
    <Input
      style={{ width: fullWidth ? "100%" : "70%" }}
      prefix={<SearchOutlined />}
      bordered={false}
      placeholder="Search posts"
      allowClear
      className="nav-search"
      onFocus={() => setFullWidth(true)}
      onBlur={() => setFullWidth(false)}
    />
  );
};

export default SearchBar;
