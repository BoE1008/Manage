import { Company } from "@/types";
import axios from "axios";

export const getSuppliersList = async (pageNo: number, pageSize: number, name?: string) => {
  const res = await axios.get(`/zc/supplier/list`, {
    params: {
      pageNo,
      pageSize,
      name
    },
  });

  return res.data;
};

export const addSupplyer = async (info: Company) => {
  const res = await axios.post(`/zc/supplier/add`, {
    ...info,
  });

  return res.data;
};

export const updateSupplyer = async (id: string, info: Company) => { 
    const res = await axios.post(`/zc/supplier/update`, {
        ...info,
        id,
    })

    return res.data;
}
