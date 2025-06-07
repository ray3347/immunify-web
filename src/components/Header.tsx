"use client";

import React, { useState } from "react";
import { Layout, Button, Typography, Avatar, Dropdown, Modal } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserOutlined } from "@ant-design/icons";
import { useActiveSession } from "../utilities/zustand";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { activeAccount } = useActiveSession();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLogoutConfirm = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    setIsModalVisible(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accountId");
    window.location.href = "/login";
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <AntHeader
      style={{
        padding: 0,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
      }}
    >
      <Button
        type="text"
        icon={
          collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
        }
        onClick={onToggle}
        style={{ width: 64, height: 64 }}
      />
      <Title level={4} style={{ margin: 0, flex: 1 }}>
        Welcome, {activeAccount?.clinic.name}
      </Title>
      <div style={{ marginLeft: "auto", marginRight: 24 }}>
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                label: "Logout",
                onClick: showLogoutConfirm,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Avatar
            style={{ backgroundColor: "#1976d2", cursor: "pointer" }}
            size={40}
            src={activeAccount?.clinic.image}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </AntHeader>
  );
};

export default Header;
