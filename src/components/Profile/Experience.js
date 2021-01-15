import React from "react";

import moment from "moment";
import { Space, Typography, List } from "antd";
const { Title } = Typography;
const Experience = (props) => {
  const experinces = props.userProfile.experiences;
  if (experinces && experinces.length > 0) {
    return (
      <List>
        {experinces
          .sort((a, b) => {
            return moment(b.whenStart) - moment(a.whenStart);
          })
          .map((exp, index) => {
            return (
              <List.Item key={index}>
                <Space direction="vertical">
                  <Title level={5}>{exp.position}</Title>
                  <Space>
                    <span>{`${moment(exp.whenStart).format("MMM YYYY")}`}</span>
                    <span>to</span>
                    <span>{`${
                      exp.whenEnd === "present"
                        ? "present"
                        : moment(exp.whenEnd).format("MMM YYYY")
                    }`}</span>
                  </Space>

                  {exp.at && <span>{`At ${exp.at}`}</span>}
                </Space>
              </List.Item>
            );
          })}
      </List>
    );
  }
  return <span>Nothing to show</span>;
};
export default Experience;
