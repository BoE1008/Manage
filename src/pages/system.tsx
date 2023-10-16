import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";
import { useEffect } from "react";
import { useRouter } from "next/router";

const System = () => {
  const login = useRecoilValue(loginState);
  const router = useRouter();

  useEffect(() => {
    !login && router.push("/login");
  }, [login, router]);
  
  return <div>{"System"}</div>;
};

export default System;
