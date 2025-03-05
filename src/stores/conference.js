import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { getShareConferenceInfoAPI } from '@/api/conference';
import { useRoute } from 'vue-router';


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
  const getConferenceInfo = async () => {
    const route = useRoute();
    const conferenceId = route.params.conferenceId;
    if (!conferenceId) return;
    const res = await getShareConferenceInfoAPI(conferenceId);
    Object.assign(conferenceInfo, res.data);
    correctConferenceId.value = true;
  }

  return {
    conferenceInfo,
    getConferenceInfo,
    correctConferenceId
  }
})
