import React from "react";
import { connect } from "react-redux";
import { ResponsivePie } from "@nivo/pie";
import { Space } from "antd";
import { ellipseAText } from "../Common/Helpers";

const PieChart = (props) => {
  const tooltipBox = (sliceData) => {
    return (
      <Space className="pie-chart-tooltip">
        <span>{`${sliceData.label}:`}</span>

        <span>{sliceData.value}</span>
      </Space>
    );
  };
  const radialLabelFormatter = (label) => {
    if (props.smallScreen) {
      return ellipseAText(label, 9);
    } else {
      return label;
    }
  };
  return (
    <ResponsivePie
      data={props.data}
      margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
      colors={{ scheme: "nivo" }}
      innerRadius={0.3}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabel={function (e) {
        return radialLabelFormatter(e.label);
      }}
      enableRadialLabels={true}
      radialLabelsSkipAngle={10}
      sliceLabelsSkipAngle={10}
      radialLabelsLinkDiagonalLength={5}
      radialLabelsLinkHorizontalLength={5}
      radialLabelsLinkStrokeWidth={1}
      tooltip={(e) => tooltipBox(e.datum.data)}
    />
  );
};

const mapStateToProps = (state) => {
  return { smallScreen: state.smallScreen };
};
export default connect(mapStateToProps)(PieChart);
