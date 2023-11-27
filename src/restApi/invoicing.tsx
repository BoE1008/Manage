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
  const res = await axiosInstance.get(`/zc/invoicing/yw/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const getinvoicingCWList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/invoicing/cw/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });
  return res.data;
};

export const submitToCw = async (invoicingId:string) => {
  const res = await axiosInstance.post(`/zc/invoicing/submitCW`, {
    invoicingId,
  });

  return res.data;
}

export const approveOne = async (invoicingId:string) => {
  const res = await axiosInstance.post(`/zc/invoicing/approve`, {
    invoicingId
  })

  return res.data;
}

export const rejectOne = async (invoicingId:string) => {
  const res = await axiosInstance.post(`/zc/invoicing/reject`, {
    invoicingId
  })

  return res.data;
}

export const logsOne = async (invoicingId: string) => {
  const res = await axiosInstance.get(
    `/zc/invoicing/log/list?invoicingId=${invoicingId}`
  );
  return res.data;
}