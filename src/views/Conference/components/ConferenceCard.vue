<script setup>
import { getConferenceInfoAPI } from '@/api/conference';
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const correctConferenceId = ref(false);

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
console.log(route.params.conferenceId);

const getConferenceInfo = async () => {
  const res = await getConferenceInfoAPI(route.params.conferenceId);
  Object.assign(conferenceInfo, res.data);
  correctConferenceId.value = true;
}
getConferenceInfo();
const formattedDate = computed(() => {
  const startDate = new Date(conferenceInfo.startTime);
  const startYear = startDate.getFullYear();
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
  const startDay = String(startDate.getDate()).padStart(2, '0');
  const startHours = String(startDate.getHours()).padStart(2, '0');
  const startMinutes = String(startDate.getMinutes()).padStart(2, '0');

  const endDate = new Date(conferenceInfo.endTime);

  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDate.getDate()).padStart(2, '0');
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

  const timeDiffInMs = endDate - startDate;
  const hoursDiff = Math.floor(timeDiffInMs / (1000 * 60 * 60)); // 小时差
  const minutesDiff = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)); // 分钟差

  let lastTime = "";
  if (hoursDiff) lastTime += hoursDiff + '小时'
  if (minutesDiff) lastTime += minutesDiff + '分'

  let status = "";
  const currentTime = new Date();
  if (currentTime >= startDate && currentTime <= endDate) {
    status = "进行中"
  } else if (currentTime >= endDate) {
    status = "已结束"
  } else {
    status = "未开始"
  }

  return {
    startDate: `${startYear}年${startMonth}月${startDay}日`,
    startTime: `${startHours}:${startMinutes}`,
    endDate: `${endYear}年${endMonth}月${endDay}日`,
    endTime: `${endHours}:${endMinutes}`,
    lastTime: lastTime,
    status: status,
  };
});



</script>

<template>
  <div v-if="correctConferenceId" class="conference-card">
    <div class="card">
      <h1 style="margin: 10px 0 20px 0;"> CollabAI </h1>
      <h2 style="margin-bottom: 10px;">{{ conferenceInfo.holderName + '的' + conferenceInfo.title + '会议' }}</h2>
      <h2 class="conference-id">{{ conferenceInfo.id }}</h2>
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
      <div class="user-card">
        <img :src="conferenceInfo.holderAvatar" alt="">
        <div class="right">
          <p>发起人</p>
          <h3>{{ conferenceInfo.holderName }}</h3>
        </div>
      </div>
    </div>
    <div class="card-button">
      <el-button style="width:100%; height: 45px; margin-bottom: 20px; color: #000;">二维码入会</el-button>
      <el-button type="primary" style="width:100%; height: 45px; margin-left: 0;">加入会议</el-button>
    </div>
  </div>
  <div v-else>错啦错啦</div>
</template>

<style scoped lang="scss">
.conference-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fdfcfc;
  height: 630px;
  width: 500px;
  margin: auto;
  padding: 20px 30px 30px 30px;
  box-shadow: 5px 3px 10px 6px rgba(0, 0, 0, 0.2);

  border-radius: 10px;

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px 30px 10px 30px;
    box-shadow: 5px 3px 10px 3px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background: url('@/assets/imgs/ConferenceCardBG.png') no-repeat;
    background-size: 100% 36%;
    background-color: #fff;

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

    .user-card {
      display: flex;
      gap: 15px;
      width: 100%;
      border-top: 1px dashed #a8bac7;
      margin-top: 20px;
      padding: 15px 0 5px 0;

      img {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }
}
</style>
