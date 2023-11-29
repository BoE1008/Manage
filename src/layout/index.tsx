import React, { ReactNode, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import User from "@/components/User";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

const { Header, Content, Sider } = Layout;

const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const [menu, setMenu] = useState();

  useEffect(() => {
    (async () => {
      if(sessionStorage.getItem('username')){
        const menu = JSON.parse(sessionStorage.getItem('menu'));
        setMenu(menu);
      }
    })();
  }, [asPath]);


  const handleClick: MenuProps["onClick"] = (props) => {
    router.push(`/${props.key}`);
  };

  return asPath !== "/login" ? (
    <Layout className="h-full" style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 5,
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
          <Image src={logo} alt="logo" width={300} height={50} />
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
      <Layout className="min-h-screen w-screen">
        <Sider
          width={200}
          style={{ position: "fixed", top: 120, left: 0, zIndex: 5, height: 'calc(100vh - 120px)' }}
          className="overflow-y-auto"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["custom"]}
            selectedKeys={[asPath.slice(1, asPath.length)]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "#198348",
              color: "#fff",
            }}
            items={menu}
            onClick={(props) => handleClick(props)}
          />
        </Sider>
        <Layout
          style={{
            paddingLeft: "200px",
            paddingTop: "120px",
            minHeight: "100%",
          }}
          className="min-h-screen"
        >
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
  ) : (
    <Layout>{children}</Layout>
  );
};

export default AppLayout;
