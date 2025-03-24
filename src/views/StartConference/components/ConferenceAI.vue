<script setup>
import { usePcmStore } from '@/stores/pcmDataStore';
import LiveScreen from './LiveScreen.vue';
const pcmStore = usePcmStore();

</script>

<template>
  <LiveScreen></LiveScreen>
  <div class="conference-ai">
    <div class="personal-voice-info">
      <h3>会议录音</h3>

      <p v-for="(text, index) in pcmStore.result" :key="index">{{ text }}</p>
    </div>
    <div class="ai-voice-info">
      <h3>实时ai总结</h3>
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

  .personal-voice-info {
    flex-basis: 50%;
    border-right: 1px solid #b7b5b5;
    max-height: 1500px;

    padding: 5px 20px;

  }

  .ai-voice-info {
    flex-basis: 50%;
    max-height: 1500px;

    padding: 5px 20px;

  }


}
</style>
