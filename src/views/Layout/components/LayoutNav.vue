<script setup>
import PersonalCard from '@/views/PersonalCenter/components/PersonalCard.vue';
</script>

<template>
  <div class="home-layout-nav">
    <h3 class="title">CollabAI</h3>

    <ul class="home-layout-nav-ul">
      <li>
        <RouterLink :to="{ name: 'home' }" class="join-conference-button">我的会议</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'joinConference' }" class="join-conference-button">加入会议</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'createConference' }" class="reserve-conference-button">预定会议</RouterLink>
      </li>
      <li>
        <PersonalCard></PersonalCard>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.home-layout-nav {
  display: flex;
  align-items: center;
  min-width: 1000px;
  height: 50px;
  padding: 10px 40px;
  background-color: #f5f8fb;
  border-bottom: 1px solid #d1cece;
  user-select: none;

  .title {
    margin-right: auto;
  }

  .home-layout-nav-ul {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    li {
      &:hover {
        color: #6397ef;

      }

      position: relative;

      .router-link-active {
        color: #6397ef;
      }

      .join-conference-button,
      .reserve-conference-button {
        border-right: 2px solid #666;
        padding: 0px 15px;
      }
    }




  }

}
</style>
