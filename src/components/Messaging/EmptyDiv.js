import React from "react";
import { Empty } from "antd";

const EmptyDiv = (props) => {
  return (
    <div className="empty-div">
      <Empty description={<span>{props.text}</span>} />
    </div>
  );
};

export default EmptyDiv;
