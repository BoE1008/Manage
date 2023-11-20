import { Input, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userInfoState } from "@/store/userInfoState";
import Background from "@/assets/images/bg.jpg";
import { login } from "@/restApi/user";
import { notification } from "antd";
import { menuHandler } from "@/utils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUserinfo = useSetRecoilState(userInfoState);

  const router = useRouter();

  const handleClick = async () => {
    const { code, message } = await login(username, password);
    if (code === 200) {
      typeof window !== "undefined" &&
        sessionStorage.setItem("username",  username );
      router.push("/");
    } else {
      notification.error({ message });
    }
  };

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
          className="!bg-pink-400 !text-white w-1/3"
          onClick={handleClick}
        >
          {"登录"}
        </Button>
      </Space>
    </div>
  );
};

export default Login;
