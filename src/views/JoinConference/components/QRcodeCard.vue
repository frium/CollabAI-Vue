<script setup>
import QrcodeVue from 'qrcode.vue';
import TimeInfo from './TimeInfo.vue';

const qrValue = window.location.href;
const qrSize = 180; // 二维码尺寸
</script>

<template>
  <div class="qc-code-card">
    <TimeInfo></TimeInfo>
    <hr>
    <qrcode-vue :value="qrValue" :size="qrSize" level="H" render-as="svg" class="qrcode" />
    <p>请使用手机扫码入会</p>
    <h3>--CollabAI--</h3>
  </div>
</template>
<style scoped lang="scss">
.qc-code-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  background: rgb(255, 255, 255);
  padding: 5px 20px 10px 20px;
  border-radius: 10px;

  hr {
    width: 100%;
    border: none;
    border-top: 1px dashed #c9c6c6;
    margin: 20px 0px;
  }

  .qrcode {
    margin: 20px 0;
  }

  h3 {
    margin-top: 10px;
  }

}
</style>
