<script setup>
import OperationMenu from './components/OperationMenu.vue';
import { useConferenceStore } from '@/stores/conferenceStore';
import { onMounted } from 'vue';

const conferenceStore = useConferenceStore();
onMounted(async () => {
  await conferenceStore.getStartConferenceInfo();

})

</script>

<template>
  <div class="head">
    <h2>
      {{ '会议主题: ' + (conferenceStore.startConferenceInfo.title ? conferenceStore.startConferenceInfo.title : "") }}
    </h2>
    <OperationMenu v-if="conferenceStore.startConferenceInfo.title"></OperationMenu>
  </div>
  <div style=" margin:  10px 0;">
    <RouterView v-if="conferenceStore.startConferenceInfo.title"></RouterView>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
