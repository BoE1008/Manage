import axios from "axios";

export const login = async (loginName: string, password: string) => {
  const res = await axios.post(`/zc/user/login?loginName=${loginName}&password=${password}`);

  return res.data;
};

export const logout = async () => {
    const res = await axios.post(`/zc/user/logout`);
    return res.data;
}
