<script setup>
import { usePcmStore } from '@/stores/pcmDataStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LiveScreen from './LiveScreen.vue';
import MarkdownViewer from './MarkdownViewer.vue';
import { getAISummaryAPI } from '@/api/conference';
import { useRoute } from 'vue-router';
import { useConferenceStore } from '@/stores/conferenceStore';

const route = useRoute();
const pcmStore = usePcmStore();
const mdContent = ref('');
const intervalId = ref(null);
const conferenceStore = useConferenceStore();
const startFetching = () => {
  if (!intervalId.value) {
    intervalId.value = setInterval(async () => {
      try {
        const res = await getAISummaryAPI(route.params.startConferenceId);
        mdContent.value = res.data.aiSummary;
      } catch (error) {
        stopFetching();
      }
    }, 1000);
  }
};

const stopFetching = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

const status = computed(() => {
  const now = new Date();
  const startTime = new Date(conferenceStore.startConferenceInfo.startTime);
  const endTime = new Date(conferenceStore.startConferenceInfo.endTime);
  return now >= startTime && now <= endTime;
});


onMounted(async () => {
  console.log(status);

  if (!status) {
    pcmStore.getOneResult();
    const res = await getAISummaryAPI(route.params.startConferenceId);
    mdContent.value = res.data.aiSummary;
  } else {
    startFetching();
  }
});

onUnmounted(stopFetching);
</script>

<template>
  <div>
    <LiveScreen></LiveScreen>
    <div class="conference-ai">
      <div class="personal-voice-info">
        <h3>会议录音</h3>
        <p v-for="(text, index) in pcmStore.result" :key="index">{{ text }}</p>
      </div>
      <div class="ai-voice-info">
        <h3>实时ai总结</h3>
        <MarkdownViewer class="markdown" :source="mdContent" :line-numbers="true">
        </MarkdownViewer>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conference-ai {
  display: flex;
  background-color: #fff;
  height: 700px;
  overflow: auto;
  margin: auto;
  box-shadow: 2px 5px 10px 3px rgba(0, 0, 0, 0.2);
  padding: 15px 0px;
  margin-top: 20px;

  .personal-voice-info {
    flex-basis: 42%;
    border-right: 1px solid #b7b5b5;
    overflow: auto;
    padding: 5px 20px;
  }

  .ai-voice-info {
    flex-basis: 58%;
    overflow: auto;
    padding: 5px 20px;
  }

}
</style>
