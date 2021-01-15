import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchJobStats } from "../../actions/job";

import { Divider, Card, Radio } from "antd";
import ListOfJobs from "../Common/ListOfJobs";

import PieChart from "./PieChart";

const Summary = (props) => {
  const { fetchJobStats, jobId } = props;
  const [leavingOrJoining, setLeavingOrJoining] = useState("leaving");
  useEffect(() => {
    fetchJobStats(jobId);
  }, [fetchJobStats, jobId]);

  const renderChart = () => {
    if (props.visitedJob) {
      const dataSource =
        leavingOrJoining === "leaving"
          ? props.visitedJob.leavers
          : props.visitedJob.joiners;
      if (dataSource) {
        const data = Object.keys(dataSource).map((jobKey) => {
          return {
            id: jobKey,
            label: ListOfJobs[jobKey],
            value: dataSource[jobKey],
          };
        });
        return (
          <div className="chart-div">
            <PieChart data={data} />
          </div>
        );
      } else {
        return (
          <div className="empty-chart-div">{`No records for users ${leavingOrJoining} this job.`}</div>
        );
      }
    } else {
      return null;
    }
  };
  return (
    <div className="custom-card">
      <Card>
        <span className="profile-name">{ListOfJobs[jobId]}</span>
        <Divider />
        <Radio.Group
          defaultValue={leavingOrJoining}
          size="large"
          onChange={(e) => setLeavingOrJoining(e.target.value)}
        >
          <Radio value="leaving">Leaving</Radio>
          <Radio value="joining">Joining</Radio>
        </Radio.Group>
        {renderChart()}
      </Card>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { visitedJob: state.visitedJob };
};
export default connect(mapStateToProps, { fetchJobStats })(Summary);
