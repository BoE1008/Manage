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
  const res = await axiosInstance.post("/zc/payment/add", info, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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

export const submitToYW = async (paymentId: string) => {
  const res = await axiosInstance.post(`/zc/payment/submitYW`, {
    paymentId,
  });

  return res.data;
};

export const submitToLD = async (paymentId: string) => {
  const res = await axiosInstance.post(`/zc/payment/submitLeader`, {
    paymentId,
  });

  return res.data;
};

export const submitLDToCW = async (paymentId: string) => {
  const res = await axiosInstance.post(`/zc/payment/submitLDToCW`, {
    paymentId,
  });

  return res.data;
};

export const submitYWToCW = async (paymentId: string) => {
  const res = await axiosInstance.post(`/zc/payment/submitYWToCW`, {
    paymentId,
  });

  return res.data;
};

export const approveOne = async (paymentId: string) => {
  const res = await axiosInstance.post(`/zc/payment/approve`, {
    paymentId,
  });

  return res.data;
};

export const rejectOne = async (paymentId: string, remark, approveState) => {
  const res = await axiosInstance.post(`/zc/payment/reject`, {
    paymentId,
    remark,
    approveState,
  });

  return res.data;
};

export const deleteOne = async (id: string) => {
  const res = await axiosInstance.get(`/zc/payment/del`, {
    params: {
      id,
    },
  });
  return res.data;
};

export const logsOne = async (paymentId: string) => {
  const res = await axiosInstance.get(
    `/zc/payment/log/list?paymentId=${paymentId}`
  );
  return res.data;
};

export const getPaymentDetailById = async (id) => {
  const res = await axiosInstance.get("/zc/payment/detail", { params: { id } });

  return res.data;
};

export const getFilesById = async (id) => {
  const res = await axiosInstance.get("/zc/payment/file/list", {
    params: { id },
  });

  return res.data;
};

export const updateFileById = async (info) => {
  const res = await axiosInstance.post(`/zc/payment/file/update`, info);

  return res.data;
};

export const deleteFileById = async (id) => {
  const res = await axiosInstance.post(`/zc/payment/file/del`, { id });

  return res.data;
};
