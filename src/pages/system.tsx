import { getLogs } from "@/restApi/log";
import { useEffect, useState } from "react";

const System = () => {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const logs = await getLogs(1, 100);
      setData(logs)
    })();
  }, []);
  return <div>{"System"}</div>;
};

export default System;
