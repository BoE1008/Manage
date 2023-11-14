import axiosInstance from "./axiosInstance";

export const getLogs = async (pageNo: number, pageSize:number) => {
  const res = await axiosInstance.get(`/zc/log/list?pageNo=${pageNo}&pageSize=${pageSize}`);
  return res.data;
};
