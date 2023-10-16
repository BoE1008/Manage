import React, { ReactNode } from "react";
import {
  UserOutlined,
  CustomerServiceOutlined,
  ProjectOutlined,
  CoffeeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, ConfigProvider } from "antd";
import Image from "next/image";
import logoPic from "@/assets/logo.jpg";
import User from "@/components/User";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: `customer`,
    icon: React.createElement(CustomerServiceOutlined),
    label: `客户管理`,
  },
  {
    key: `applyer`,
    icon: React.createElement(CoffeeOutlined),
    label: `供应商管理`,
  },
  {
    key: `project`,
    icon: React.createElement(ProjectOutlined),
    label: `项目管理`,
  },
  {
    key: `user`,
    icon: React.createElement(UserOutlined),
    label: `用户管理`,
  },
  {
    key: `system`,
    icon: React.createElement(SettingOutlined),
    label: `系统管理`,
  },
];

const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();

  const handleClick: MenuProps["onClick"] = (props) => {
    router.push(props.key);
  };

  return (
    <Layout className="h-screen">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100px",
          padding: 0,
          background: "#162455",
        }}
        className="w-full h-[100px] text-white"
      >
        <Image
          src={logoPic}
          width={200}
          height={40}
          alt="logo"
          className="object-contain object-center"
        />
        <User />
      </Header>
      <Layout>
        <Sider width={200} theme="dark">
          <Menu
            mode="inline"
            defaultSelectedKeys={["customer"]}
            defaultOpenKeys={["customer"]}
            style={{ height: "100%", borderRight: 0, background: "#1E2B55" }}
            items={items}
            className="text-white hover:text-pink-400"
            onClick={(props) => handleClick(props)}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 10,
              paddingBottom: 0,
              margin: 0,
              minHeight: 280,
              background: "linear-gradient(to right, #263B7E, #182657)",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
