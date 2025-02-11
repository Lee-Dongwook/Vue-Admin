/* eslint-disable style/arrow-parens */
import type { Axios, AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/pinia/stores/user";
import { getToken } from "@@/utils/cache/cookies";
import axios from "axios";
import { get, merge } from "lodash-es";

function logout() {
  useUserStore().logout();
  location.reload();
}

function createInstance() {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => {
      const apiData = response.data;
      const responseType = response.request?.responseType;

      if (responseType === "blob" || responseType === "arraybuffer")
        return apiData;

      const code = apiData.code;

      if (code === undefined) {
        ElMessage.error("undefined");
        return Promise.reject(new Error("undefined"));
      }

      switch (code) {
        case 0:
          return apiData;
        case 401:
          return logout();
        default:
          ElMessage.error(apiData.message || "Error");
          return Promise.reject(new Error("Error"));
      }
    },
    (error) => {
      // status 是 HTTP 状态码
      const status = get(error, "response.status");
      const message = get(error, "response.data.message");
      switch (status) {
        case 400:
          error.message = "400 error";
          break;
        case 401:
          error.message = message || "401 error";
          logout();
          break;
        case 403:
          error.message = message || "403 error";
          break;
        case 404:
          error.message = "404 error";
          break;
        case 408:
          error.message = "408 error";
          break;
        case 500:
          error.message = "500 error";
          break;
        case 501:
          error.message = "501 error";
          break;
        case 502:
          error.message = "502 error";
          break;
        case 503:
          error.message = "503 error";
          break;
        case 504:
          error.message = "504 error";
          break;
        case 505:
          error.message = "505 error";
          break;
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    },
  );
  return instance;
}

function createRequest(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = getToken();
    const defaultConfig: AxiosRequestConfig = {
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        // eslint-disable-next-line style/quote-props
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      },
      data: {},
      timeout: 5000,
      withCredentials: true,
    };
    const mergeConfig = merge(defaultConfig, config);
    return instance(mergeConfig);
  };
}

const instance = createInstance();

export const request = createRequest(instance);
