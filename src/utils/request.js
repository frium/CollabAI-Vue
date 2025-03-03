import axios from "axios";

const request = axios.create({
  baseURL: '/api',
})

//拦截器
request.interceptors.request.use(config => {
  if (!config.noAuth) {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `${token}`;
  }
  return config;
}, e => Promise.reject(e))

request.interceptors.response.use(res => res.data, e => {
  // ElNotification({
  //   title: 'Error',
  //   message: e.response.data.message,
  //   type: 'error'
  // });
  // if (e.response.status === 401) {
  //   const userStore = useUserStore();
  //   userStore.clearUserInfo();
  //   router.push('/login');
  //   ElNotification({
  //     title: 'Warning',
  //     message: '用户身份过期,请重新登录!',
  //     type: 'warning',
  //     zIndex: 10000
  //   });
  // };
  return Promise.reject(e);
})
export default request;
