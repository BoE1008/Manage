import { Project } from "@/types";
import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getProjectsList = async (
  pageNo: number,
  pageSize: number,
  name?: string
) => {
  const res = await axiosInstance.get("/zc/project/list", {
    params: {
      pageNo,
      pageSize,
      name,
    },
  });

  return res.data;
};

export const getProjectType = async () => {
  const res = await axiosInstance.get("/zc/project/type/list");
  return res.data;
};

export const addProject = async (info: Project) => {
  const res = await axiosInstance.post("/zc/project/add", {
    ...info,
  });

  return res.data;
};

export const updateProject = async (id: string, info: Project) => {
  const res = await axiosInstance.post(`/zc/project/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await axiosInstance.post(`/zc/project/delete`, { id });
  return res.data;
};

export const getProjectYSList = async (
  projectId: string,
  pageNo: number,
  pageSize: number
) => {
  const res = await axiosInstance.get(`/zc/project/ys/list`, {
    params: {
      projectId,
      pageNo,
      pageSize,
    },
  });

  return res.data;
};

export const addProjectYS = async (info) => {
  const res = await axiosInstance.post(`/zc/project/ys/add`, {
    ...info,
  });

  return res.data;
};

export const updateProjectYS = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/project/ys/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const addProjectYf = async (info) => {
  const res = await axiosInstance.post(`/zc/project/yf/add`, {
    ...info,
  });

  return res.data;
};

export const updateProjectYf = async (id: string, info) => {
  const res = await axiosInstance.post(`/zc/project/yf/update`, {
    id,
    ...info,
  });

  return res.data;
};

export const exportProject = async() => {
  const res = await axios.get(`/zc/project/export`);
  return res.data;
}
