import axios from "axios";

const request = axios.create({
  baseURL: '/api',
})

//拦截器
request.interceptors.request.use(config => {

  return config;
}, e => Promise.reject(e))

request.interceptors.response.use(res => res.data, e => {

  return Promise.reject(e);
})
export default request;
