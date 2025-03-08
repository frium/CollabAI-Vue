<script setup>
import OperationMenu from './components/OperationMenu.vue';
import { useConferenceStore } from '@/stores/conferenceStore';
import { ref } from 'vue';

const conferenceStore = useConferenceStore();
conferenceStore.getStartConferenceInfo();
</script>

<template>
  <div class="head">
    <h1>{{ '会议主题: ' + (conferenceStore.startConferenceInfo.title ? conferenceStore.startConferenceInfo.title : "") }}
    </h1>
    <OperationMenu></OperationMenu>
  </div>
  <div style=" margin:  10px 30px;">
    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
