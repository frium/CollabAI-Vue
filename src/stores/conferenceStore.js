import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { getShareConferenceInfoAPI } from '@/api/conference';
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
  const getShareConferenceInfo = async () => {
    const route = useRoute();
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

  return {
    conferenceInfo,
    getShareConferenceInfo,
    correctConferenceId
  }
})
