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

export const startConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/start/${conferenceId}`,
    method: 'POST',
  })
}

export const stopConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/stop/${conferenceId}`,
    method: 'POST',
  })
}

export const leaveConferenceAPI = (conferenceId) => {
  return request({
    url: `/mt/leave/${conferenceId}`,
    method: 'POST',
  })
}
export const uploadConferenceSpeechAPI = (conferenceId, data) => {
  return request({
    url: `/speech/recognize/${conferenceId}`,
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    method: 'POST',
    data
  })
}
export const getConferenceSpeechAPI = (conferenceId) => {
  return request({
    url: `/speech/sync/${conferenceId}`,
  })
}

export const getAISummaryAPI = (conferenceId) => {
  return request({
    url: `/sync/${conferenceId}`,
  })
}

