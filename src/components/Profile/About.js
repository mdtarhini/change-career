import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

const About = (props) => {
  return <Paragraph>{props.userProfile.bio}</Paragraph>;
};

export default About;
