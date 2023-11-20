import axiosInstance from "./axiosInstance";

export const getRoleList = async() => {

    const res =await axiosInstance.get(`/zc/role/list`)
    return res.data
}