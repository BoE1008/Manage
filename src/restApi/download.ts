import axiosInstance from "./axiosInstance";

export const downloadFile = async(filename:string) => {
    const res = await axiosInstance.get(`/zc/common/download?fileName=${filename}&delete=true`)

    return res.data;
}