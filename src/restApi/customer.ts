import { Company } from "@/types";
import axiosInstance from "./axiosInstance";

export const getCustomersList = async (
  pageNo: number,
  pageSize: number,
  name?: string
) => {
  const res = await axiosInstance.get(`/zc/custom/list`, {
    params: {
      pageNo,
      pageSize,
      name,
    },
  });

  return res.data;
};

export const getCustomersYSList = async (projectId: string) => {
  const res = await axiosInstance.get(`/zc/custom/listYsCustom`, {
    params: {
      projectId,
    },
  });

  return res.data;
};

export const addCustomer = async (info: Company) => {
  const res = await axiosInstance.post(`/zc/custom/add`, {
    ...info,
  });

  return res.data;
};

export const updateCustomer = async (id: string, info: Company) => {
  const res = await axiosInstance.post(`/zc/custom/update`, {
    ...info,
    id,
  });

  return res.data;
};

export const deleteCustomer = async (id: string) => {
  const res = await axiosInstance.post(`/zc/custom/delete`, {
    id,
  });

  return res.data;
};
