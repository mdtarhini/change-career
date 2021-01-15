import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input, Button, Alert, Card, Space, Row, Col } from "antd";
import {
  MailOutlined,
  LockOutlined,
  BulbOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { signUp, signIn, restorePassword } from "../../actions/auth";
import Welcome from "./Welcome";

const SignUpOrSignIn = (props) => {
  const [messageVisibility, setMessageVisibility] = useState(false);
  const options = {
    signup: {
      onFinish: (values) => props.signUp(values),
      buttonTitle: "Create Account",
      title: "Create your account",
      extra: (
        <p className="already-have">
          Already have an account ? <Link to="/signin">Log in!</Link>
        </p>
      ),
    },
    signin: {
      onFinish: (values) => props.signIn(values),
      buttonTitle: "Log In",
      title: "Log in to your account",
      extra: (
        <div className="already-have">
          <p>
            <Link to="/forgotpassword">Forgot password!</Link>
          </p>
          Don't have an account ? <Link to="/signup">Register now!</Link>
        </div>
      ),
    },
    forgotpassword: {
      onFinish: (values) => props.restorePassword(values),

      title: "Restore your password",
      buttonTitle: "Restore Password",
      extra: (
        <p className="already-have">
          <Link to="/signin">Back to Log in page!</Link>
        </p>
      ),
    },
  };
  const onFinish = (values) => {
    const whatToDo = props.history.location.pathname.substring(1);
    setMessageVisibility(true);
    options[whatToDo].onFinish(values);
  };
  const whatToDo = props.history.location.pathname.substring(1);

  const auth = props.auth;
  return (
    <Row className="setup-div">
      <Link to="/">
        <Button
          className="cancel-setup"
          type="primary"
          size="small"
          shape="circle"
          danger
          icon={<CloseOutlined />}
        />
      </Link>

      <Col xs={24} md={12} lg={8} xl={6}>
        <Welcome />
      </Col>
      <Col xs={24} md={12} lg={8} xl={6}>
        <Card className="sign-up-card">
          <Space direction="vertical" className="setup-div-title" size={0}>
            <Link to="">
              <BulbOutlined />
            </Link>
            <span>{options[whatToDo].title}</span>
          </Space>
          <Form
            size="large"
            className="login-form"
            onFinish={onFinish}
            onValuesChange={() => setMessageVisibility(false)}
          >
            {whatToDo === "signup" && (
              <React.Fragment>
                <Form.Item
                  name="firstName"
                  rules={[
                    { required: true, message: "Please type your first name!" },
                  ]}
                >
                  <Input placeholder="First Name*" className="sign-up-input" />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Please type your last name!" },
                  ]}
                >
                  <Input placeholder="Last Name*" className="sign-up-input" />
                </Form.Item>
              </React.Fragment>
            )}

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email*"
                className="sign-up-input"
              />
            </Form.Item>
            {whatToDo !== "forgotpassword" && (
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password*"
                  className="sign-up-input"
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                loading={auth.doingSomething}
              >
                {options[whatToDo].buttonTitle}
              </Button>
              {options[whatToDo].extra}
            </Form.Item>
          </Form>
          {auth.errorMessage !== "" && messageVisibility && (
            <Alert message={auth.errorMessage} type="error" showIcon />
          )}
          {auth.message !== "" && messageVisibility && (
            <Alert message={auth.message} type="success" showIcon />
          )}
        </Card>
      </Col>
    </Row>
  );
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, {
  signUp: signUp,
  signIn: signIn,
  restorePassword: restorePassword,
})(SignUpOrSignIn);
