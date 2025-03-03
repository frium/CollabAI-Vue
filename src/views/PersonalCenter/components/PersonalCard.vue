<script setup>

</script>

<template>

  <div class="personal-card">
    <span>常常的鱼</span>
    <el-dropdown placement="bottom" class="el-dropdown-bottom">
      <img src="https://blog.frium.top/upload/%E6%B5%81%E8%90%A4.jpg" alt="">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <RouterLink to="/personalCenter">个人主页</RouterLink>
          </el-dropdown-item>
          <el-dropdown-item>
            <RouterLink>退出登录</RouterLink>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<style scoped lang="scss">
.personal-card {
  display: flex;
  align-items: center;

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
