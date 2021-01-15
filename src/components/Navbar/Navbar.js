import React from "react";
import { connect } from "react-redux";
import { Col, Row } from "antd";
import Logo from "./Logo";

import Navigation from "./Navigation";
import Auth from "./Auth";

const Navbar = (props) => {
  if (
    ["/signin", "/signup", "/setup", "/forgotpassword"].includes(
      props.history.location.pathname
    )
  ) {
    return null;
  } else {
    return (
      <Row justify="space-between" align="middle" className="navbar">
        <Col>
          <Logo />
        </Col>
        {props.auth.user && (
          <Col>
            <Navigation />
          </Col>
        )}
        <Col>
          <Auth />
        </Col>
      </Row>
    );
  }
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Navbar);
