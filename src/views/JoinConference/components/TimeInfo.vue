<script setup>
import { useConferenceStore } from '@/stores/conferenceStore';
import { ElMessage } from "element-plus";
import { formatConferenceTimeAPI } from '@/utils/time'
const copyId = () => {
  navigator.clipboard.writeText(conferenceInfo.id)
  ElMessage.success('已复制会议ID')
}

const conferenceStore = useConferenceStore();
const conferenceInfo = conferenceStore.conferenceInfo;

const formattedDate = formatConferenceTimeAPI(conferenceInfo.startTime, conferenceInfo.endTime);

</script>

<template>
  <h1 style="margin: 10px 0 10px 0;"> CollabAI </h1>
  <h2 style="margin-bottom: 10px;">{{ conferenceInfo.holderName + '的' + conferenceInfo.title + '会议' }}</h2>
  <h2 class="conference-id" @click="copyId">{{ conferenceInfo.id }}</h2>
  <div class="time">
    <div class="start">
      <h1>{{ formattedDate.startTime }}</h1>
      <p>{{ formattedDate.startDate }}</p>
    </div>
    <div class="middle">
      <hr>
      <div class="last-time">{{ formattedDate.lastTime }}</div>
      <span class="status">{{ formattedDate.status }}</span>
    </div>
    <div class="end">
      <h1>{{ formattedDate.endTime }}</h1>
      <p>{{ formattedDate.endDate }}</p>
    </div>
  </div>

</template>

<style scoped lang="scss">
.conference-id {
  position: relative;
  display: -webkit-box;
  align-items: center;
  justify-content: center;
  width: 300px;
  white-space: nowrap;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  gap: 2px;
  margin-bottom: 15px;
  text-align: center;
  padding-right: 24px;
  cursor: default;
}


.conference-id::after {
  content: "";
  position: absolute;
  display: inline-block;
  background: url('@/assets/icons/copy.svg');
  background-size: contain;
  width: 24px;
  height: 24px;
  top: 4px;
  right: -3px;
  cursor: pointer;
}

.time {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .start,
  .end {
    display: flex;
    flex-direction: column;
  }

  .end {
    align-items: flex-end;

  }

  .middle {
    display: flex;
    align-items: center;
    width: 30%;
    position: relative;

    hr {
      width: 100%;
      border: none;
      border-top: 1px solid #c9c6c6;
    }

    .last-time,
    .status {
      position: absolute;
      max-width: 100%;

    }

    .last-time {
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #f2f2f2;
      font-size: 14px;
      border-radius: 5px;
      padding: 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status {
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      color: #5a9cf8;
    }
  }
}
</style>
