import React from "react";
import { getFormattedElpasedTime } from "../Common/Helpers";
import { Button, Space } from "antd";
const COLORS = {
  with: "rgba(0, 108, 196, 1)",
  without: "rgba(180, 180, 184, 1)",
};
const Poll = ({
  options,
  showResult,
  onVoting,
  postId,
  pollTime,
  disabled,
}) => {
  const totalVotes = options.reduce(
    (total, currentOption) => total + currentOption.votes,
    0
  );
  const pollInfo = () => {
    return (
      <span className="poll-info">
        {`${totalVotes} vote${totalVotes === 1 ? "" : "s"}. ${
          pollTime < Date.now()
            ? "(Final results)"
            : getFormattedElpasedTime(pollTime)
        }`}
      </span>
    );
  };
  if (showResult) {
    return (
      <Space direction="vertical" className="poll-div">
        {options.map((option, index) => {
          const percentage =
            totalVotes === 0
              ? 0
              : Math.floor(100 * (option.votes / totalVotes));
          return (
            <div
              key={index}
              className="poll-result"
              style={{
                background: `linear-gradient(to right, ${COLORS.with} ${percentage}%, ${COLORS.without} ${percentage}%, ${COLORS.without})`,
              }}
            >
              <Space>
                <span>{option.value}</span>
                <span>{percentage} %</span>
              </Space>
            </div>
          );
        })}
        {pollInfo()}
      </Space>
    );
  } else {
    return (
      <Space direction="vertical" className="poll-div">
        {options.map((option, index) => {
          return (
            <Button
              block
              disabled={disabled}
              className="poll-button"
              key={index}
              onClick={() => onVoting(postId, index)}
            >
              {option.value}
            </Button>
          );
        })}
        {pollInfo()}
      </Space>
    );
  }
};
export default Poll;
