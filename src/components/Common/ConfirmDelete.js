import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

const ConfirmDelete = ({ title, content, onOk }) => {
  confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    content: content,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk: onOk,
    onCancel() {},
  });
};
export default ConfirmDelete;
