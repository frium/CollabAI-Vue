<script setup>
import { getConferenceInfoAPI, joinConferenceAPI } from '@/api/conference';
import QRcodeCard from './components/QRcodeCard.vue';
import HeadInfo from './components/HeadInfo.vue';
import { ElMessage } from "element-plus";
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useConferenceStore } from '@/stores/conference';

const route = useRoute();
const conferenceStore = useConferenceStore();
const correctConferenceId = ref(false);


const conferenceInfo = conferenceStore.conferenceInfo;


const getConferenceInfo = async () => {
  const res = await getConferenceInfoAPI(route.params.conferenceId);
  Object.assign(conferenceInfo, res.data);
  correctConferenceId.value = true;
}
getConferenceInfo();


const joinConference = async () => {
  await joinConferenceAPI(route.params.conferenceId);
  ElMessage.success('加入会议成功')
  //TODO 路由跳转至开会页面
}

const showQRcode = ref(false);
const changeShowQRcodeStatus = () => {
  showQRcode.value = !showQRcode.value;
}
</script>

<template>
  <div v-if="correctConferenceId" class="conference-card">
    <HeadInfo></HeadInfo>
    <div class="card-button">
      <el-button style="width:100%; height: 45px; margin-bottom: 20px; color: #000;"
        @click="changeShowQRcodeStatus">打开邀请二维码</el-button>
      <el-button type="primary" style="width:100%; height: 45px; margin-left: 0;"
        @click="joinConference">加入会议</el-button>
    </div>
    <div v-show="showQRcode" class="overlay" @click="changeShowQRcodeStatus"></div>
    <div class="qr-code" v-show="showQRcode">
      <QRcodeCard></QRcodeCard>
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
  width: 450px;
  margin: auto;
  padding: 20px 30px 30px 30px;
  box-shadow: 5px 3px 10px 6px rgba(0, 0, 0, 0.2);
  border-radius: 10px;

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  .qr-code {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
}
</style>
