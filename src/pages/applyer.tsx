import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Applyer = () => {
  const login = useRecoilValue(loginState);
  const router = useRouter();

  useEffect(() => {
    !login && router.push("/login");
  }, [login, router]);

  return <div>{"Applyer"}</div>;
};

export default Applyer;
