import axios from "axios";
import router from "@/router";
import notificationToast from "./notificationToast ";
const request = axios.create({
  baseURL: '/api',
})

request.interceptors.request.use(config => {
  if (!config.noAuth) {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `${token}`;
  }
  return config;
}, e => Promise.reject(e))

request.interceptors.response.use(
  res => {
    if (res.data.code == 40005) {
      return res.data;
    }
    if (res.data.code !== 200) {
      // if (res.data.code === 40002) {
      //   notificationToast.warning('用户身份过期,请重新登录!');
      //   router.push({ name: "login" });
      //   return Promise.reject(res.data);
      // }
      const errorMsg = res.data.msg || '请求异常，请稍后重试'
      notificationToast.error(errorMsg)
      return Promise.reject(res.data);
    }

    // 正常返回数据
    return res.data;
  },
  error => {
    if (error.response?.status === 401) {
      notificationToast.warning('用户身份过期,请重新登录!')
      sessionStorage.setItem("redirectUrl", router.currentRoute.value.fullPath);
      router.push("/login");
      return Promise.reject(error);
    }

    const errorMsg = error.response.data.msg || '请求异常，请稍后重试'
    notificationToast.error(errorMsg)
    return Promise.reject(error);
  })
export default request;
