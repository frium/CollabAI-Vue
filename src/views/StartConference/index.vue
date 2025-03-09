<script setup>
import OperationMenu from './components/OperationMenu.vue';
import { useConferenceStore } from '@/stores/conferenceStore';

const conferenceStore = useConferenceStore();
conferenceStore.getStartConferenceInfo();
</script>

<template>
  <div class="head">
    <h2>{{ '会议主题: ' + (conferenceStore.startConferenceInfo.title ? conferenceStore.startConferenceInfo.title : "") }}
    </h2>
    <OperationMenu></OperationMenu>
  </div>
  <div style=" margin:  10px 0;">
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
