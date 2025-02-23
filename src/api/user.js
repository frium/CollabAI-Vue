import request from '@/utils/request'
export const loginAPI = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}
export const registerAPI = (data) => {
  return request({
    url: '/user/register',
    method: 'POST',
    data
  })
}
export const forgotPasswordAPI = (data) => {
  return request({
    url: '/user/forgot',
    method: 'POST',
    data
  })
}
export const usernameUniqueCheckAPI = (username) => {
  return request({
    url: '/user/uniqueCheck',
    params: { username }
  })
}
export const getCodeAPI = (username) => {
  return request({
    url: '/user/code',
    params: { username }
  })
}
