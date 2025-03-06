<script setup>
import { formatConferenceTimeAPI } from '@/utils/time'

const props = defineProps({
  conferenceInfo: {
    type: Object
  }
});
const formattedDate = formatConferenceTimeAPI(props.conferenceInfo.startTime, props.conferenceInfo.endTime);
console.log(formattedDate);

</script>

<template>
  <RouterLink to="/">
    <div class="conference-card">
      <div class="left">
        <span class="status">{{ formattedDate.status }}</span>
        <div class="triangle"></div>
        <p class="title">{{ props.conferenceInfo.title }}</p>
        <p>发起人:
          <span style="color: blue; font-size: 18px;">sbzzy</span>
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
      top: 5px;
      left: -11px;
      width: 65px;
      height: 24px;
      background: pink;
      padding: 3px 10px;
      border-radius: 2px;
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
