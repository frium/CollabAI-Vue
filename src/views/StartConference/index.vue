<script setup>
import OperationMenu from './components/OperationMenu.vue';
</script>

<template>
  <div class="head">
    <h1>title</h1>
    <OperationMenu></OperationMenu>
  </div>
  <div style=" margin:  10px 30px;">
    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
