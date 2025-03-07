<script setup>
import ConferenceCard from './components/ConferenceCard.vue';
import { getMyConferenceAPI } from '@/api/conference';
import { onMounted, ref } from 'vue';
const myConferences = ref([]);
onMounted(async () => {
  const res = await getMyConferenceAPI();
  myConferences.value = res.data;

});
</script>

<template>
  <h2>我的会议</h2>
  <div class="conference-cards">
    <template v-for="myConference in myConferences" :key="myConference.id">
      <ConferenceCard :conferenceInfo="myConference"></ConferenceCard>
    </template>
  </div>
</template>

<style scoped lang="scss">
.conference-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  justify-content: center;
  gap: 20px 30px;
  width: 100%;
  margin-top: 15px;
}
</style>
