import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const SideBar = () => {
  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={toggleDrawer}
        style={{ position: "fixed", top: 20, left: 20, zIndex: 1000 }}
      />

      {/* Drawer for Side Menu */}
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        visible={visible}
        width={250}
      >
        <Menu mode="inline" style={{ height: "100%" }}>
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Schedular</Menu.Item>
          <Menu.Item key="3">Classroom</Menu.Item>
          <Menu.Item key="3">Teacher</Menu.Item>
          <Menu.Item key="4">Report</Menu.Item>
          <Menu.Item key="5">Log</Menu.Item>
          <Menu.Item key="6">Settings</Menu.Item>
          
        </Menu>
      </Drawer>
    </>
  );
};

export default SideBar;