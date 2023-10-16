import { Input, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logopic from "@/assets/logo.jpg";
import Image from "next/image";

const Login = () => {
  return (
    <div className="w-full h-full flex flex-col items-center gap-y-10">
      <div className="w-1/2">
        <Image
          src={logopic}
          alt="logo"
          className="object-contain object-center w-1/2"
          layout="responsive"
        />
      </div>
      <Space direction="vertical" className="w-1/4 text-center">
        <Input
          size="large"
          placeholder="请输入用户名"
          prefix={<UserOutlined />}
        />
        <Input.Password size="large" placeholder="请输入密码"/>
        <Button size='large' className="bg-pink-400 text-white w-1/3">{"登录"}</Button>
      </Space>
    </div>
  );
};

export default Login;
