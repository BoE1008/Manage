import { User } from "@/types";
import axiosInstance from "./axiosInstance";

export const login = async (loginName: string, password: string) => {
  const res = await axiosInstance.post(
    `/zc/user/login?loginName=${loginName}&password=${password}`
  );

  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post(`/zc/user/logout`);
  return res.data;
};

export const getUserList = async (
  pageNo: number,
  pageSize: number,
  userName: string,
  deptId: string
) => {
  const res = await axiosInstance.get(
    `/zc/user/list?pageNo=${pageNo}&pageSize=${pageSize}&userName=${userName}&deptId=${deptId}`
  );
  return res.data;
};

export const addUser = async (info: User) => {
  const res = await axiosInstance.post(`/zc/user/add`, {
    ...info,
  });

  return res.data;
};

export const updateUser = async (info: User, id: string) => {
  const res = await axiosInstance.post(`/zc/user/update`, {
    ...info,
    id,
  });

  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.get(`/zc/user/del`, {
    params: {
      id,
    },
  });
  return res.data;
};

export const updatePassword = async (info) => {
  const res = await axiosInstance.post(
    `/zc/user/update/pwd?id=${info.id}&oldPassword=${info.oldPassword}&newPassword=${info.newPassword}`
  );

  return res.data;
};
