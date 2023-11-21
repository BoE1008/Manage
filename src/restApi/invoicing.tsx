import axiosInstance from "./axiosInstance";

export const getinvoicingList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/invoicing/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const addInvoicing = async (info) => {
  const res = await axiosInstance.post("/zc/invoicing/add", {
    ...info,
  });

  return res.data;
};

export const updateInvoicing = async (id: string, info: Project) => {
  const res = await axiosInstance.post(`/zc/invoicing/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const getinvoicingYWList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/invoicing/YW/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const getinvoicingCWList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/invoicing/CW/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};
