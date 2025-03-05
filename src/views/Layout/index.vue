<script setup>
import LayoutNav from './components/LayoutNav.vue';
</script>

<template>
  <LayoutNav></LayoutNav>
  <div class="home-router-view">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.home-router-view {
  margin-top: 15px;
  min-height: calc(100vh - 70px);
}
</style>
