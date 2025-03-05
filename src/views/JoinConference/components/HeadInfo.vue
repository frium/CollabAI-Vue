<script setup>
import { useConferenceStore } from '@/stores/conferenceStore';
import TimeInfo from './TimeInfo.vue';

const conferenceStore = useConferenceStore();
const conferenceInfo = conferenceStore.conferenceInfo;

</script>

<template>
  <div class="card">
    <TimeInfo></TimeInfo>
    <div class="user-card">
      <img :src="conferenceInfo.holderAvatar" alt="">
      <div class="right">
        <p>发起人</p>
        <h3>{{ conferenceInfo.holderName }}</h3>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.card {
  position: relative;
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
</style>
