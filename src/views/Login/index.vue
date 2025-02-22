<script setup>
import Login from './components/Login.vue'
import Register from './components/Register.vue'
</script>

<template>
  <div class="content-box">
    <div class="login-register-box">
      <div :style="{
        flexBasis: '50%',
        display: 'flex',
        justifyContent: 'center',
        borderRight: '2px solid rgba(181, 159, 159, 0.3)'
      }">
        <div class="describe">
          <h2 class="title">CollabAI</h2>
          <p>
            你说的对，但是《必蓝档案》是阿罗娜研发的一款全新游戏抽卡。故事发生在一个被称作「募集」的抽卡世界里，在这里被阿罗娜选中的人将被授予「九蓝一金」，引导非酋之力。你将扮演一位名为「sensei」的神秘角色，在卡池中歪出性格各异、能力独特的学生，和她们一起吃井，寻找不存在的「出货」，逐步发掘「前程四井」的真相。
          </p>
        </div>
      </div>
      <RouterView :style="{ flexBasis: '50%' }"></RouterView>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-box {
  position: relative;
  width: 100vw;
  height: 100vh;

  .login-register-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    display: flex;
    width: 62%;
    height: 66%;
    min-width: 900px;
    background: linear-gradient(96deg,
        rgb(135, 189, 228) 10%,
        rgb(255, 255, 255) 63%,
        rgba(255, 255, 255, 1) 100%);
    margin: auto;
    border-radius: 12px;
    overflow: hidden;

    .describe {
      width: 70%;
      margin-top: 70px;
    }
  }
}
</style>
