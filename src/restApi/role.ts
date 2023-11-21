import axiosInstance from "./axiosInstance";

export const getRoleList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/role/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const addRole = async (info) => {
  const res = await axiosInstance.post("/zc/role/add", {
    ...info,
  });

  return res.data;
};

export const updateRole = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/role/update`, {
    id,
    ...info,
  });

  return res.data;
};
