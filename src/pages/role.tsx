import { getRoleList } from "@/restApi/role";
import { useEffect } from "react";

const Role = () => {
  useEffect(() => {
    (async () => {
      const roles = await getRoleList();
      console.log(roles);
    })();
  }, []);

  return <div>aaa</div>;
};

export default Role;
