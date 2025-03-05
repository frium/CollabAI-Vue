<script setup>
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

const router = useRouter();
const jwt = localStorage.getItem('jwt')
const logout = () => {
  localStorage.removeItem('jwt');
  router.push({ name: 'login' });
  ElMessage.success("已退出账号")
}

</script>

<template>

  <div v-if="jwt" class="personal-card">
    <span>常常的鱼</span>
    <el-dropdown placement="bottom" class="el-dropdown-bottom">
      <img src="https://blog.frium.top/upload/%E6%B5%81%E8%90%A4.jpg" alt="">
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

  .el-dropdown-bottom {
    margin-left: 10px;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

}
</style>
