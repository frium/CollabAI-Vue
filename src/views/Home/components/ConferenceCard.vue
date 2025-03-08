<script setup>
import { formatConferenceTimeAPI } from '@/utils/time'
import { computed } from 'vue';

const props = defineProps({
  conferenceInfo: {
    type: Object
  }
});
const formattedDate = formatConferenceTimeAPI(props.conferenceInfo.startTime, props.conferenceInfo.endTime);
const statusClass = computed(() => {
  switch (formattedDate.status) {
    case '未开始':
      return 'status-blue';
    case '进行中':
      return 'status-green';
    case '已结束':
      return 'status-red';
    default:
      return '';
  }
});

const triangleClass = computed(() => {
  switch (formattedDate.status) {
    case '未开始':
      return 'triangle-blue';
    case '进行中':
      return 'triangle-green';
    case '已结束':
      return 'triangle-red';
    default:
      return '';
  }
});
</script>

<template>
  <RouterLink :to="`/startConference/${props.conferenceInfo.id}`">
    <div class="conference-card">
      <div class="left">
        <div :class="['status', statusClass]">
          <span style="scale: 0.9; display: block;">{{ formattedDate.status }}</span>
        </div>
        <div :class="['triangle', triangleClass]"></div>
        <p class="title">{{ props.conferenceInfo.title }}</p>
        <p>发起人:
          <span style="color: #6397ef; font-size: 18px;">{{ props.conferenceInfo.holderName }}</span>
        </p>
        <p style=" font-size: 14px; margin-top: 5px;">{{ formattedDate.startDate + " " + formattedDate.startTime }}</p>
        <hr>
        <p style=" font-size: 14px;">{{ formattedDate.endDate + " " + formattedDate.endTime }}</p>
      </div>
      <div class="right">
        <img :src="props.conferenceInfo.coverImg" alt="" draggable="false">
      </div>
    </div>
  </RouterLink>
</template>
<style scoped lang="scss">
.conference-card {
  position: relative;
  display: flex;
  width: 310px;
  height: 150px;
  background: #fffdfd;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
  border: 1px solid #d1cece;

  &:hover {
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.1);

    .title {
      color: #1b76d0;
    }
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    transition: all 0.3s;

    .time {
      font-size: 14px;
      color: #ec2323;
    }
  }

  p {
    font-size: 16px;
    white-space: nowrap;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  hr {
    margin: 3px auto;
    width: 10%;
    border: none;
    border-top: 1px solid #000000;
  }

  .left {
    width: 58%;
    margin-top: 18px;
    padding: 10px 0 10px 20px;

    .status {
      position: absolute;
      font-size: 10px;
      color: #f5f9ff;
      top: 5px;
      left: -11px;
      width: 65px;
      height: 24px;
      background: pink;
      padding: 3px 10px;
      border-radius: 2px;
    }

    .status-blue {
      background-color: #5a9cf8;
    }

    .status-green {
      background-color: #67c23a;
    }

    .status-red {
      background-color: #f56c6c;
    }

    .triangle {
      position: absolute;
      top: 28.3px;
      left: -11px;
      width: 0;
      height: 0;
      border-top: 6px solid #f3bdbc;
      border-right: 6px solid #f3bdbc;
      border-left: 6px solid transparent;
      border-bottom: 6px solid transparent;
      filter: drop-shadow(-1px 1px 1px rgba(0, 0, 0, 0.1));
    }

    .triangle-blue {
      border-top: 6px solid #5a9cf8;
      border-right: 6px solid #5a9cf8;
    }

    .triangle-green {
      border-top: 6px solid #67c23a;
      border-right: 6px solid #67c23a;
    }

    .triangle-red {
      border-top: 6px solid #f56c6c;
      border-right: 6px solid #f56c6c;
    }
  }

  .right {
    width: 42%;
    flex-shrink: 0;
    user-select: none;

    img {
      user-select: none;
      border-radius: 10px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      mask: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    }
  }

}
</style>
