<script setup>
import Login from './components/Login.vue'
import Register from './components/Register.vue'
</script>

<template>
  <div class="content-box">
    <div class="login-register-box">
      <div class="describe">描述</div>
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
    background: rgb(126, 119, 119);
    margin: auto;
    border-radius: 12px;
    overflow: hidden;

    .describe {
      flex-basis: 50%;
    }
  }
}
</style>
