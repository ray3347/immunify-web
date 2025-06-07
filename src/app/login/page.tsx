"use client";
import React, { useState } from "react";
import { Card, Input, Button, Typography, Form } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import {
  message,
  notification as customNotification,
  modal as customModal,
} from "../../../store/message";
import { login } from "./util";
import { useActiveSession } from "../../utilities/zustand";
const { Title } = Typography;

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function LoginPage() {
  const { switchAccount } = useActiveSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const loginObj = await login(values.username, values.password);
      switchAccount(loginObj);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accountId", loginObj.id);
      router.push("/dashboard");
      setLoading(false)
    } catch (ex) {
      customNotification.error({
        message: "Invalid Credentials",
        description: "The username or password you entered is incorrect.",
        placement: "topRight",
      });
      setLoading(false);
    }
    // setTimeout(() => {
    //   setLoading(false);
    //   if (values.username === 'admin' && values.password === 'admin') {

    //     localStorage.setItem('isLoggedIn', 'true');
    //     router.push('/dashboard');
    //   } else {
    //     customNotification.error({
    //     message: "Invalid Credentials",
    //     description: "The username or password you entered is incorrect.",
    //     placement: "topRight",
    //   });
    //   }
    // }, 1000);
  };

  return (
    <ClientOnly>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e3f0fd 0%, #fafbfc 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{ width: 350, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          variant="borderless"
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Immunify Clinic Dashboard
            </Title>
            <div style={{ color: "#888", fontSize: 14 }}>
              Please log in to continue
            </div>
          </div>
          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ fontWeight: 600 }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ClientOnly>
  );
}
