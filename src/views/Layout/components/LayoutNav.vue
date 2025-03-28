<script setup>
import PersonalCard from '@/views/PersonalCenter/components/PersonalCard.vue';
import { ref } from 'vue';

const iframeBigAi = ref(null);
const showBigAI = () => {
  iframeBigAi.value.style.width = iframeBigAi.value.style.width === '0px' ? '100%' : '0px';
}
</script>

<template>
  <iframe ref="iframeBigAi"
    src="https://www.das-ai.com/dasChat?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiICAgIFwidGVuYW50SWRcIjogMTg3NzU5NjQ3ODQwNzQ0NjUyOVxufSIsImlhdCI6MTc0MzE2NTE0MCwianRpIjoiNmY1ZjM1NjctMjhiNi00YTVkLTllOTEtMDQyNTAxNjZkMDZmIn0.JIDAdMasTu_HDZ4v0UxgDX0Q1X0WerPR1HIoAAuik18"
    class="big-ai" frameborder="0"></iframe>
  <div class="home-layout-nav">
    <RouterLink :to="{ name: 'home' }">
      <h2>CollabAI</h2>
    </RouterLink>

    <ul class="home-layout-nav-ul">
      <li>
        <button class="ai-assistant" @click="showBigAI"> 小恒助理</button>
      </li>
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
.big-ai {
  z-index: 10;
  top: 50.5px;
  left: 0;
  position: absolute;
  width: 0px;
  height: calc(100% - 50.5px);
  transition: all 0.5s ease-out;
}

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
    font-size: 18px;
  }

  .home-layout-nav-ul {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    li {
      position: relative;

      &:hover {
        color: #6397ef;
      }

      .ai-assistant {
        font-size: 14px;
        border-right: 2px solid #666;
        padding: 0px 15px;

        &:hover {
          color: #6397ef;
        }
      }

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
