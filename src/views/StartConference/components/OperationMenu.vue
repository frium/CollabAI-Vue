<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div style="height: 35px;">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        菜单栏
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :class="{ active: route.name === 'conferenceAI' }"
            @click="router.push({ name: 'conferenceAI', params: { startConferenceId: route.params.startConferenceId } })">
            会议ai
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: route.name === 'conferenceDetail' }"
            @click="router.push({ name: 'conferenceDetail', params: { startConferenceId: route.params.startConferenceId } })">
            会议详情
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: route.name === 'editConference' }"
            @click="router.push({ name: 'editConference', params: { startConferenceId: route.params.startConferenceId } })">
            编辑会议
          </el-dropdown-item>
          <el-dropdown-item v-if="true">立即开始</el-dropdown-item>
          <el-dropdown-item v-else>立即结束</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.el-dropdown-link {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

::v-deep(.active) {
  color: #409eff;
  background: rgb(235.9, 245.3, 255);
}
</style>
