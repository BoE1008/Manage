import axios from "axios";
import qs from "qs";
import { notification } from "antd";

const axiosInstance = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

if (typeof window === undefined) {
 
} else {
  axiosInstance.interceptors.response.use(
    (value) => {
      if (value.data.code !== 200) {
        if(value.data.code === 401) {
          window.location.href = '/login'
          return Promise.reject()
        }
        notification.error({ message: value.data.message });
        return Promise.reject()
      } else {
        return value;
      }
    },
    () => {
      notification.error({ message: "服务器异常" });
      return Promise.reject()
    }
  );
}

export default axiosInstance;
