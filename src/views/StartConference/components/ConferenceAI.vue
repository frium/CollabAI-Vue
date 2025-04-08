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

const downloadMarkdown = () => {
  const blob = new Blob([mdContent.value], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conferenceStore.startConferenceInfo.title}会议总结.md`;
  document.body.appendChild(a);
  a.addEventListener('click', function () {
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 5000);
  }, { once: true });

  document.body.appendChild(a);
  a.click();
}

onMounted(async () => {
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
    <LiveScreen v-if="status"></LiveScreen>
    <div class="conference-ai">
      <div class="personal-voice-info">
        <h3 style="margin-bottom: 10px;">会议录音</h3>
        <div class="message-container">
          <div class="message-item" v-for="(text, index) in pcmStore.result" :key="index">
            <div class="username-box">
              <span class="username">
                {{ text.includes(':') ? text.split(':')[0] + ':' : '' }}
              </span>
            </div>
            <div class="content-box">
              <span>{{ text.includes(':') ? text.split(':').slice(1).join(':') : text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ai-voice-info">
        <div style="display: flex; justify-content: space-between;">
          <h3>实时ai总结</h3>
          <el-button type="text" @click="downloadMarkdown" style="margin-right: 20px;">导出</el-button>
        </div>
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

    .message-container {
      width: 100%;
    }

    .message-item {
      display: flex;
      margin-bottom: 5px;
      line-height: 1.8;
    }

    .username-box {
      width: 80px;
      text-align: right;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .content-box {
      flex: 1;
      padding-left: 10px;
      word-break: break-word;
    }

    .username {
      color: rgb(127, 173, 238);
      font-size: 18px;
    }
  }

  .ai-voice-info {
    flex-basis: 58%;
    overflow: auto;
    padding: 5px 20px;
  }

}
</style>
