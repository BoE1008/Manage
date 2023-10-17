import { useRecoilState } from "recoil";
import { loginState } from "@/store/loginState";
import { Button } from "antd";
import { useRouter } from "next/router";

const User = () => {
  const [login, setLoginState] = useRecoilState(loginState);
  const router = useRouter();

  const handleClick = () => {
    setLoginState(true);
    router.push("/login");
  };

  return (
    <div className="pr-5 text-[#198348]">
      {login ? (
        "admin"
      ) : (
        <Button className="bg-pink-400 text-[#198348]" onClick={handleClick}>
          {"登录"}
        </Button>
      )}
    </div>
  );
};

export default User;
