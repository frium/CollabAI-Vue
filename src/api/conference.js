import request from '@/utils/request'
export const getConferenceInfoAPI = (conferenceId) => {
  return request({
    url: `/mt/${conferenceId}`,
  });
};
