<script setup>
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import { getUserInfoAPI } from '@/api/user';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

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
})
</script>

<template>

  <div v-if="jwt" class="personal-card">
    <span>{{ userStore.userInfo.nickname }}</span>
    <el-dropdown placement="bottom" class="el-dropdown-bottom">
      <img :src="userStore.userInfo.avatar" alt="">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <RouterLink :to="{ name: 'personalCenter' }">个人主页</RouterLink>
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
  display: flex;
  align-items: center;
  font-size: 14px;


  span {
    width: 80px;
    display: -webkit-box;
    white-space: nowrap;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin-left: 10px;
  }

  .el-dropdown-bottom {

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

}
</style>
