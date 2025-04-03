<script setup>
const text = `CollabAI智能会议助手—让会议更高效，协作更轻松 \n\n
CollabAI能实时记录会议内容，并智能提炼关键讨论、决策和待办事项，自动生成清晰简洁的会议总结。支持中/英语言识别和发言人区分，确保信息准确无误。会后一键生成结构化会议纪要，并支持内容导出，
大幅提升团队协作效率。无论是远程会议还是跨国沟通，都能帮助团队节省时间、减少信息遗漏，让每一次会议都更有价值。——专注会议效率，释放生产力！`;
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
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <h2 class="title" style="line-height: 1.8;">CollabAI</h2>
            <h3 style="margin-left: 10px; line-height: 1.8;text-align: right;">让会议更高效，协作更轻松</h3>
          </div>
          <p style="letter-spacing: 1px; line-height: 1.8;  text-indent: 2em;">
            CollabAI能实时记录会议内容，并智能提炼关键讨论、决策和待办事项，自动生成清晰简洁的会议总结。支持中/英语言识别和发言人区分，确保信息准确无误。会后一键生成结构化会议纪要，并支持内容导出，
            大幅提升团队协作效率。无论是远程会议还是跨国沟通，都能帮助团队节省时间、减少信息遗漏，让每一次会议都更有价值
          </p>
          <p style=" width: 100% ;letter-spacing: 1px; margin: 10px 0; text-align: right">
            ——专注会议效率，释放生产力！
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
      width: 75%;
      margin-top: 70px;
    }
  }
}
</style>
