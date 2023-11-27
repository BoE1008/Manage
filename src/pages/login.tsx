import { Input, Space, Button, Form } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userInfoState } from "@/store/userInfoState";
import Background from "@/assets/images/bg.jpg";
import { login } from "@/restApi/user";
import { notification } from "antd";
import { menuHandler } from "@/utils";
import { menuTreeState } from "@/store/userInfoState";
import { getMenu } from "@/restApi/menu";

const Login = () => {
  const router = useRouter();

  const [form] = Form.useForm();

  const userLogin = async () => {
    const values = form.getFieldsValue();
    const { code, message } = await login(values.username, values.password);
    if (code === 200) {
      sessionStorage.setItem("username", values.username);
      const data = await getMenu();
      sessionStorage.setItem(
        "menu",
        JSON.stringify(menuHandler(data.entity.data))
      );

      router.push("/");
    } else {
      notification.error({ message });
    }
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      userLogin();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, []);

  return (
    <div
      className="p-20 w-full h-screen flex flex-col items-center justify-center"
      style={{
        background: `url(${Background.src})`,
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Form form={form} className="w-1/4 min-w-40 text-center">
        <Form.Item name="username">
          <Input
            size="large"
            placeholder="请输入用户名"
            prefix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item name='password'>
          <Input.Password
            size="large"
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            className="!bg-pink-400 !text-white w-1/3"
            onClick={userLogin}
          >
            {"登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
