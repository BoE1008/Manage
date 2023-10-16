import { Input, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logopic from "@/assets/logo.jpg";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { loginState } from "@/store/loginState";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setLoginState = useSetRecoilState(loginState);

  const router = useRouter();

  const handleClick = () => {
    if (username.trim() === "admin" && password.trim() === "123456") {
      setLoginState(true);
      router.push("/customer");
    }
  };

  return (
    <div className="p-20 w-full h-screen flex flex-col items-center gap-y-10 bg-gradient-to-r from-[#263B7E] to-[#182657]">
      <div className="w-full">
        <Image
          src={logopic}
          alt="logo"
          className="object-contain object-center md:w-1/2 mx-auto"
        />
      </div>
      <Space
        direction="vertical"
        size="large"
        className="w-1/4 min-w-40 text-center"
      >
        <Input
          size="large"
          placeholder="请输入用户名"
          prefix={<UserOutlined />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          size="large"
          className="bg-pink-400 text-white w-1/3"
          onClick={handleClick}
        >
          {"登录"}
        </Button>
      </Space>
    </div>
  );
};

export default Login;
