import { useRecoilState } from "recoil";
import { userInfoState } from "@/store/userInfoState";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { DownOutlined } from "@ant-design/icons";
import { logout } from "@/restApi/user";

const User = () => {
  const router = useRouter();

  const [hovered, setHovered] = useState(false);

  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(sessionStorage.getItem("username")!);
  }, []);

  return (
    <div className="pr-5 text-[#198348]">
      <div
        className="flex font-medium tracking-wider w-full py-2.5 px-3.5 relative justify-center items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-row gap-x-3">
          <span className="text-[#198348]">{username}</span>
          <DownOutlined
            className={clsx(
              "w-5 stroke-white transform transition-transform",
              hovered && "rotate-180"
            )}
          />
        </div>
        <ul
          className={clsx(
            "font-medium tracking-wider grid leading-10 gap-0.5 <md:w-full min-w-40 w-max py-4 top-12 md:top-15 right-0 z-30 absolute lg:py-5",
            !hovered && "hidden"
          )}
        >
          <li
            onClick={async () => {
              await logout();
              sessionStorage.removeItem("username");
              sessionStorage.removeItem("menu");
              setHovered(false);
              router.push("/login");
            }}
            className="cursor-pointer px-7.5 transform transition-all hover:scale-110"
          >
            {"Sign Out"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default User;
