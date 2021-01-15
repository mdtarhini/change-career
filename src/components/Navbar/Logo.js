import React from "react";
import { Link } from "react-router-dom";
import { BulbOutlined } from "@ant-design/icons";

const Logo = () => {
  return (
    <Link to="/">
      <BulbOutlined className="navbar-logo" />
    </Link>
  );
};
export default Logo;
