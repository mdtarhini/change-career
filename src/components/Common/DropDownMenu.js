import React from "react";

//style-related stuff
import { Menu, Dropdown, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const DropDownMenu = ({ optionArray, shape, children }) => {
  const menu = (
    <Menu className="common-dropdown">
      {optionArray.map((item, index) => {
        if (item) {
          if (item.isModalTrigger) {
            return <React.Fragment key={index}>{item.trigger}</React.Fragment>;
          } else if (item.text === "---" && !item.icon && !item.func) {
            return <Menu.Divider key={index} />;
          } else if (item.text && !item.icon && !item.func) {
            return (
              <p className="common-dropdown-text" key={index}>
                {item.text}
              </p>
            );
          } else {
            return (
              <Menu.Item
                key={index}
                icon={item.icon}
                onClick={({ domEvent }) => {
                  domEvent.stopPropagation();
                  item.func && item.func();
                }}
              >
                <span>{item.text}</span>
              </Menu.Item>
            );
          }
        }
        return null;
      })}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      {children ? (
        children
      ) : (
        <Button
          type={shape ? "" : "link"}
          shape={shape ? shape : ""}
          size="small"
          className="ant-dropdown-link"
          style={{ padding: "0px" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i className="common-dropdown-icon">
            <EllipsisOutlined />
          </i>
        </Button>
      )}
    </Dropdown>
  );
};
export default DropDownMenu;
