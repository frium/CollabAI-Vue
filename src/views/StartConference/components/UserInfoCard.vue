<script setup>
const props = defineProps({
  headImg: {
    type: String,
    default: 'https://collabai.frium.top/api/static/avatar/user/722c0bbf519e2c1fe2c08fa15e4592a9.jpg'
  },
  username: {
    type: String,
    default: '用户'
  }
})
</script>

<template>
  <div class="user-info-card">
    <img :src="props.headImg" alt="">
    <span>{{ props.username }}</span>
  </div>
</template>

<style scoped lang="scss">
.user-info-card {
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    flex-shrink: 0;
    width: 100%;
    height: 50px;
    border-radius: 10%;
  }
}
</style>
