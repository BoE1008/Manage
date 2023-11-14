import axiosInstance from "./axiosInstance";

export const getMenu = async () => {
  const res = await axiosInstance.get("/zc/menu/tree");

  return res.data;
};
