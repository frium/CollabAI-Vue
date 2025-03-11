<script setup>
import { getMyAuthAPI, startConferenceAPI, stopConferenceAPI } from '@/api/conference';
import { useConferenceStore } from '@/stores/conferenceStore';
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const myAuth = ref(-1);

onMounted(async () => {
  const authRes = await getMyAuthAPI(route.params.startConferenceId);
  myAuth.value = authRes.data.authType;
  status.value = getStatus();
})
const getStatus = () => {
  const now = new Date();
  const startTime = new Date(conferenceStore.startConferenceInfo.startTime);
  const endTime = new Date(conferenceStore.startConferenceInfo.endTime);
  console.log(endTime);

  if (now < startTime) {
    return 1;
  } else if (now < endTime) {
    return 2;
  } else {
    return -1;
  }
}
const conferenceStore = useConferenceStore();
console.log(conferenceStore.startConferenceInfo.startTime);
const status = ref(-1);

const startConference = async () => {
  await startConferenceAPI(route.params.startConferenceId);
  ElMessage.success('会议已经开始!');
  status.value = 0;
}
const endConference = async () => {
  await stopConferenceAPI(route.params.startConferenceId);
  ElMessage.success('会议已经结束!');
  status.value = -1;
}
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
          <el-dropdown-item v-if="myAuth === 1 || myAuth === 2" :class="{ active: route.name === 'editConference' }"
            @click="router.push({ name: 'editConference', params: { startConferenceId: route.params.startConferenceId } })">
            编辑会议
          </el-dropdown-item>
          <el-dropdown-item v-if="(myAuth === 1 || myAuth === 2) && status === 1"
            @click="startConference">立即开始</el-dropdown-item>
          <el-dropdown-item v-else-if="(myAuth === 1 || myAuth === 2) && status === 2"
            @click="endConference">立即结束</el-dropdown-item>
          <el-dropdown-item v-else style="height: 0; padding: 0;"></el-dropdown-item>
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
