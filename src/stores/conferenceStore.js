import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { getConferenceInfoAPI, getShareConferenceInfoAPI } from '@/api/conference';
import { useRoute } from 'vue-router';
import router from '@/router';


export const useConferenceStore = defineStore('conference', () => {
  const conferenceInfo = reactive({
    "id": "",
    "title": "",
    "holderName": "",
    "holderAvatar": "h",
    "isHolder": null,
    "startTime": "",
    "endTime": "",
    "coverImg": "",
    "speechText": "",
    "mdContent": "",
    "aiSummary": "",
    "createTime": ""
  });
  const correctConferenceId = ref(false);
  const route = useRoute();

  const getShareConferenceInfo = async () => {
    const conferenceId = route.params.conferenceId;
    if (!conferenceId) return;
    try {
      const res = await getShareConferenceInfoAPI(conferenceId);
      Object.assign(conferenceInfo, res.data);
      correctConferenceId.value = true;
    }
    catch {
      router.push({ name: 'joinConference' })
    }
  }
  const startConferenceInfo = ref({});

  const getStartConferenceInfo = async () => {
    const res = await getConferenceInfoAPI(route.params.startConferenceId);
    startConferenceInfo.value = res.data;
  }

  return {
    conferenceInfo,
    getShareConferenceInfo,
    correctConferenceId,
    startConferenceInfo,
    getStartConferenceInfo
  }
})
