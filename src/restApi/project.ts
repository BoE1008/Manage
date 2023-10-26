import { Project } from "@/types";
import axios from "axios";

export const getProjectsList = async (
  pageNo: number,
  pageSize: number,
  name?: string
) => {
  const res = await axios.get("/zc/project/list", {
    params: {
      pageNo,
      pageSize,
      name,
    },
  });

  return res.data;
};

export const addProject = async (info: Project) => {
  const res = await axios.post("/zc/project/add", {
    ...info,
  });

  return res.data;
};

export const updateProject = async (id: string, info: Project) => {
  const res = await axios.post(`/zc/project/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const getProjectYSList = async (
  projectId: string,
  pageNo: number,
  pageSize: number
) => {
  const res = await axios.get(`/zc/project/ys/list`, {
    params: {
      projectId,
      pageNo,
      pageSize,
    },
  });

  return res.data;
};

export const addProjectYS = async (info) => {
  const res = await axios.post(`/zc/project/ys/add`, {
    ...info,
  });

  return res.data;
};

export const updateProjectYS = async (id: string, info) => {
  const res = await axios.post(`/zc/project/ys/update`, {
    id,
    ...info,
  });

  return res.data;
};


export const addProjectYf = async (info) => {
  const res = await axios.post(`/zc/project/yf/add`, {
    ...info,
  });

  return res.data;
};

export const updateProjectYf = async (id: string, info) => {
  const res = await axios.post(`/zc/project/yf/update`, {
    id,
    ...info,
  });

  return res.data;
};
