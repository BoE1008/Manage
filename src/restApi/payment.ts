import axiosInstance from "./axiosInstance";

export const getPaymentList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/payment/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const addPayment = async (info) => {
  const res = await axiosInstance.post("/zc/payment/add", {
    ...info,
  });

  return res.data;
};

export const updatePayment = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/payment/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const getPaymentYWList = async (pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get(`/zc/payment/yw/list`, {
      params: {
        pageNo,
        pageSize,
      },
    });
    return res.data;
  };

  export const getPaymentCWList = async (pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get(`/zc/payment/cw/list`, {
      params: {
        pageNo,
        pageSize,
      },
    });
    return res.data;
  };

  export const getPaymentLDList = async (pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get(`/zc/payment/ld/list`, {
      params: {
        pageNo,
        pageSize,
      },
    });
    return res.data;
  };



