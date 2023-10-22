import { Company } from "@/types";
import axios from "axios";

export const getCustomersList = async (
  pageNo: number,
  pageSize: number,
  name?: string
) => {
  const res = await axios.get(`/zc/custom/list`, {
    params: {
      pageNo,
      pageSize,
      name,
    },
  });

  return res.data;
};

export const addCustomer = async (info: Company) => {
  const res = await axios.post(`/zc/custom/add`, {
    ...info,
  });

  return res.data;
};

export const updateCustomer = async (id: string, info: Company) => {
  const res = await axios.post(`/zc/custom/update`, {
    ...info,
    id,
  });

  return res.data;
};
