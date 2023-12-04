import axiosInstance from "./axiosInstance";

export const getCustomBankList = async (customSupplierId) => {
  const res = await axiosInstance.get(`/zc/account/custom/list`, {
    params: {
      customSupplierId,
    },
  });

  return res.data;
};

export const addCustomBank = async (customSupplierId, info) => {
  const res = await axiosInstance.post(`/zc/account/custom/add`, {
   ...info,
   customSupplierId
  });

  return res.data;
};

export const updateCustomBank = async (customSupplierId, info) => {
    const res = await axiosInstance.post(`/zc/account/custom/update`, {
     ...info,
     customSupplierId
    });
  
    return res.data;
  };
