<script setup>
import { useLayoutStore } from '@/stores/layoutStore';
import LayoutNav from './components/LayoutNav.vue';
const layoutStore = useLayoutStore();
</script>

<template>
  <LayoutNav></LayoutNav>
  <div class="home-router-view">
    <router-view v-if="layoutStore.layoutRequestState"></router-view>
  </div>
</template>

<style scoped lang="scss">
.home-router-view {
  width: 1350px;
  min-height: calc(100vh - 70px);
  margin: 15px auto 0 auto;
  padding: 10px 30px;
}
</style>
