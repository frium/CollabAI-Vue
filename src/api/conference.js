import request from '@/utils/request'
export const getConferenceInfoAPI = (conferenceId) => {
  return request({
    url: `/mt/${conferenceId}`,
  });
};
export const getShareConferenceInfoAPI = (conferenceId) => {
  return request({
    url: `/mt/share/${conferenceId}`,
  });
};


export const joinConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/join/${conferenceId}`,
    method: 'POST',
  });
};

