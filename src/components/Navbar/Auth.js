import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import User from "./User";
import { Button, Space } from "antd";

const Auth = (props) => {
  if (props.auth.user) {
    return <User />;
  } else {
    return (
      <Space>
        <Link to="/signin">
          <Button type="primary">Log In</Button>
        </Link>

        <Link to="/signup">
          <Button type="primary">Sign Up</Button>
        </Link>
      </Space>
    );
  }
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Auth);
