import request from '@/utils/request'
export const getConferenceInfoAPI = (conferenceId) => {
  return request({
    url: `/mt/${conferenceId}`,
  });
};


export const joinConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/join/${conferenceId}`,
    method: 'POST',
  });
};

