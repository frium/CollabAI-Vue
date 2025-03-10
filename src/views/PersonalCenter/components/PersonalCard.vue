<script setup>
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import { getUserInfoAPI } from '@/api/user';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useLayoutStore } from '@/stores/layoutStore';

const router = useRouter();
const jwt = localStorage.getItem('jwt');
const userStore = useUserStore();
const logout = () => {
  localStorage.removeItem('jwt');
  router.push({ name: 'login' });
  ElMessage.success("已退出账号")
}
onMounted(async () => {
  const res = await getUserInfoAPI();
  Object.assign(userStore.userInfo, res.data);
  const layoutStore = useLayoutStore();
  layoutStore.layoutRequestState = true;
})
</script>

<template>

  <div v-if="jwt" class="personal-card">
    <el-dropdown placement="bottom" class="el-dropdown-bottom">
      <div style="display: flex; align-items: center;">
        <span style="color: black;">{{ userStore.userInfo.nickname }}</span>
        <img :src="userStore.userInfo.avatar" alt="">
      </div>
      <template #dropdown>
        <el-dropdown-menu style="width: 120px;">
          <el-dropdown-item>
            <RouterLink :to="{ name: 'personalCenter' }" style=" color: black;">个人主页</RouterLink>
          </el-dropdown-item>
          <el-dropdown-item>
            <button @click="logout">退出登录</button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div v-else class="to-login">
    <RouterLink :to="{ name: 'login' }">点击登录</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.personal-card {
  span {
    width: 80px;
    white-space: nowrap;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin: 0 6px;
  }

  .el-dropdown-bottom .el-tooltip__trigger:focus-visible {
    outline: none;
  }

  .el-dropdown-bottom {

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

}

.to-login {
  margin: 0 10px;
}
</style>
