import { Inter } from "next/font/google";
import Login from "./login";
import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const login = useRecoilValue(loginState);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-20 ${inter.className}`}
    >
      {login ? <div>aaa</div> : <Login />}
    </main>
  );
}
