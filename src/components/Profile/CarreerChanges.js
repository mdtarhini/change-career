import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Divider } from "antd";
import moment from "moment";
import { ArrowRightOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import ListOfJobs from "../Common/ListOfJobs";

const CareerChanges = (props) => {
  const ChangeDiagram = ({ before, after }) => {
    return (
      <Row
        className="career-change-diagram"
        align="middle"
        justify="center"
        gutter={[8, 8]}
      >
        <Col span={props.smallScreen ? 24 : 10}>
          <Link to={`/job/${before}`}>
            <div className="cell">
              <span>{ListOfJobs[before]}</span>
            </div>
          </Link>
        </Col>

        <Col span={props.smallScreen ? 24 : 4}>
          {!props.smallScreen && <ArrowRightOutlined />}
          {props.smallScreen && <ArrowDownOutlined />}
        </Col>

        <Col span={props.smallScreen ? 24 : 10}>
          <Link to={`/job/${after}`}>
            <div className="cell">
              <span>{ListOfJobs[after]}</span>
            </div>
          </Link>
        </Col>
      </Row>
    );
  };
  if (props.userProfile?.changeType) {
    return (
      <div>
        <Divider>{`${
          props.userProfile.changeType === "seeking"
            ? "Looking for a change since"
            : "Made change on"
        } ${moment(props.userProfile.changeDate).format("YYYY-MM")}`}</Divider>
        <ChangeDiagram
          before={props.userProfile.changeFrom}
          after={props.userProfile.changeTo}
        />
      </div>
    );
  } else {
    return <span>Nothing to show</span>;
  }
};
const mapStateToProps = (state) => {
  return {
    smallScreen: state.smallScreen,
  };
};
export default connect(mapStateToProps)(CareerChanges);
