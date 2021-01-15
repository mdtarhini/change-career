import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  EditOutlined,
  ExperimentFilled,
  SwapOutlined,
  InfoCircleFilled,
  MessageOutlined,
} from "@ant-design/icons";
import About from "./About";
import CarreerChanges from "./CarreerChanges";
import Experience from "./Experience";
import countryList from "../Common/countryList";
import { selectChat } from "../../actions/messaging";
import { Card, Avatar, Space, Menu, Row, Col, Button } from "antd";
import history from "../../history";
const tabList = {
  about: {
    label: "About",
    icon: <InfoCircleFilled />,
    content: <About />,
  },
  change: {
    label: "Carrer Changes",
    icon: <SwapOutlined />,
    content: <CarreerChanges />,
  },
  experience: {
    label: "Experience",
    icon: <ExperimentFilled />,
    content: <Experience />,
  },
};
const Summary = (props) => {
  const [currentTab, setCurrentTab] = useState("about");
  const handleClick = (e) => {
    setCurrentTab(e.key);
  };
  const onMessageClicked = () => {
    props.selectChat(props.userProfileId);
    history.push("/messaging");
  };
  return (
    <Card className="custom-card">
      <Row justify="space-between">
        <Col>
          <Space>
            <Avatar
              size={{ xs: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size="small">
              <span className="profile-name">{`${props.userProfile.firstName} ${props.userProfile.lastName}`}</span>
              <span className="profile-description">
                {countryList[props.userProfile.country]}
              </span>
            </Space>
          </Space>
        </Col>
        {props.userProfileId === props.auth.user?.uid ? (
          <Col>
            <Link to="/setup/edit">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Link>
          </Col>
        ) : props.auth.user ? (
          <Col>
            <Button
              type="primary"
              shape="circle"
              icon={<MessageOutlined />}
              onClick={onMessageClicked}
            />
          </Col>
        ) : null}
      </Row>

      <Menu
        className="profile-summary-menu"
        onClick={handleClick}
        selectedKeys={[currentTab]}
        mode="horizontal"
      >
        {Object.keys(tabList).map((tabKey) => {
          return (
            <Menu.Item key={tabKey} icon={tabList[tabKey].icon}>
              {!props.smallScreen && <span>{tabList[tabKey].label}</span>}
            </Menu.Item>
          );
        })}
      </Menu>

      {React.cloneElement(tabList[currentTab].content, {
        userProfile: props.userProfile,
      })}
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    smallScreen: state.smallScreen,
    auth: state.auth,
  };
};
export default connect(mapStateToProps, { selectChat })(Summary);
