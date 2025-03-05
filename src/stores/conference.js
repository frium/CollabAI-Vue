import { defineStore } from 'pinia'
import { reactive } from 'vue';

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

  return { conferenceInfo }
})
