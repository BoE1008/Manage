import axios from "axios";

export const getLogs = async (pageNo: number, pageSize:number) => {
  const res = await axios.get(`/zc/log/list?pageNo=${pageNo}&pageSize=${pageSize}`);
  return res.data;
};
