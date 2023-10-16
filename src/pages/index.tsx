import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const login = useRecoilValue(loginState);
  const router = useRouter();

  useEffect(() => {
    login ? router.push("/customer") : router.push("/login");
  }, [login, router]);

  return <></>;
}
