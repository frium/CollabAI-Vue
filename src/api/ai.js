import request from '@/utils/request'
export const getAITokenAPI = () => {
  return request({
    url: `/getToken`,
  });
};
