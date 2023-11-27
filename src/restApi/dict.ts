import axiosInstance from "./axiosInstance";

export const getDictById = async () => {
  const res = await axiosInstance.get(`/zc/dict/tree/list`);

  return res.data;
};

export const getDictList = async (pageNo: number, pageSize: number) => {
  const res = await axiosInstance.get(`/zc/dict/list`, {
    params: {
      pageNo,
      pageSize,
    },
  });

  return res.data;
};

export const addDict = async (info) => {
  const res = await axiosInstance.post(`/zc/dict/add`, {
    ...info,
  });

  return res.data;
};

export const addDictData = async (info) => {
  const res = await axiosInstance.post(`/zc/dict/data/add`, {
    ...info,
  });

  return res.data;
};

export const updateDict = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/dict/update`, {
    ...info,
    id,
  });

  return res.data;
};

export const updateDictData = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/dict/data/update`, {
    ...info,
    id,
  });

  return res.data;
};

export const getDictDetail = async (
  dictTypeId: string,
  pageNo: number,
  pageSize: number
) => {
  const res = await axiosInstance.get(`/zc/dict/data/list`, {
    params: {
      dictTypeId,
      pageNo,
      pageSize,
    },
  });

  return res.data;
};
