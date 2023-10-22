import React, { ReactNode } from "react";
import {
  UserOutlined,
  CustomerServiceOutlined,
  ProjectOutlined,
  CoffeeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import User from "@/components/User";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: `customer`,
    icon: React.createElement(CustomerServiceOutlined),
    label: `客户管理`,
  },
  {
    key: `supplyer`,
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
    router.push(`/${props.key}`);
  };

  return (
    <Layout className="h-full">
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex:5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100px",
          padding: 0,
          background: "#fff",
        }}
        className="w-full h-[100px]"
      >
        <Link href="/" className="flex flex-row items-center">
          <p className="font-Major text-[#198348] text-[80px]">甄察供应链</p>
          <h2
            style={{
              color: "#198348",
              fontSize: "24px",
              fontWeight: "bold",
              marginLeft: "20px",
            }}
          >
            专业版
          </h2>
        </Link>
        <User />
      </Header>
      <Layout className="h-full">
        <Sider width={200} style={{ position: "fixed", top: 120, left: 0,zIndex:5 }} className="h-full" >
          <Menu
            mode="inline"
            defaultSelectedKeys={["customer"]}
            defaultOpenKeys={["customer"]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "#198348",
              color: "#fff",
            }}
            items={items}
            onClick={(props) => handleClick(props)}
          />
        </Sider>
        <Layout style={{ paddingLeft: "200px", paddingTop: '120px' }} className="h-full">
          <Content
            style={{
              margin: 15,
              minHeight: 280,
              background: "#FFF",
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
