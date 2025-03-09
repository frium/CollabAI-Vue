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
export const getMyConferenceAPI = () => {
  return request({
    url: `/mt/list`,
  });
};

export const uploadCoverImgAPI = (data) => {
  return request({
    url: `/mt/img/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
}

export const createConferenceAPI = (data) => {
  return request({
    url: '/mt/create',
    method: 'POST',
    data
  })
}

export const updateConferenceInfoAPI = (data) => {
  return request({
    url: '/mt/edit',
    method: 'PUT',
    data
  })
}


export const getMyAuthAPI = (conferenceId) => {
  return request({
    url: `/mt/auth/${conferenceId}`,
  });
}

export const getParticipantsAPI = (conferenceId) => {
  return request({
    url: `/mt/participants/${conferenceId}`,
  });
}

export const updateParticipantsAPI = (conferenceId, data) => {
  return request({
    url: `/mt/participants/${conferenceId}`,
    method: 'PUT',
    data
  })
}

export const deleteConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/del/${conferenceId}`,
    method: 'DELETE',
  })
}
