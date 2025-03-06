import axios from "axios";
import { ElNotification } from 'element-plus';
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
      if (res.data.code === 401) {
        notificationToast.warning('用户身份过期,请重新登录!')
        // ElNotification({
        //   title: 'Warning',
        //   message: '用户身份过期,请重新登录!',
        //   type: 'warning',
        //   zIndex: 10000
        // });
        router.push({ name: "login" });
        return Promise.reject(null);
      }
      const errorMsg = res.data.msg || '请求异常，请稍后重试'
      notificationToast.error(errorMsg)
      return Promise.reject(null);
    }

    // 正常返回数据
    return res.data;
  },
  error => {
    if (error.response?.status === 401) {
      notificationToast.warning('用户身份过期,请重新登录!')
      // ElNotification({
      //   title: 'Warning',
      //   message: '用户身份过期,请重新登录!',
      //   type: 'warning',
      //   zIndex: 10000
      // });
      router.push({ name: "login" });
      return Promise.reject(error);
    }

    const errorMsg = res.data.msg || '请求异常，请稍后重试'
    notificationToast.error(errorMsg)
    return Promise.reject(error);
  })
export default request;
