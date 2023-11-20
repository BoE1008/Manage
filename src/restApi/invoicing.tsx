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
