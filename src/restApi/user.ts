import { User } from "@/types";
import axios from "axios";

export const login = async (loginName: string, password: string) => {
  const res = await axios.post(`/zc/user/login?loginName=${loginName}&password=${password}`);

  return res.data;
};

export const logout = async () => {
    const res = await axios.post(`/zc/user/logout`);
    return res.data;
}

export const getUserList = async(pageNo:number,pageSize:number, userName:string ) => {
  const res = await axios.get(`/zc/user/list?pageNo=${pageNo}&pageSize=${pageSize}&userName=${userName}`);
  return res.data;
}

export const addUser = async(info:User) => {
  const res = await axios.post(`/zc/user/add`, {
    ...info,
  });

  return res.data;
}

export const updateUser = async(info:User,id: string) => {
  const res = await axios.post(`/zc/user/update`, {
    ...info,
    id,
  });

  return res.data;
}
