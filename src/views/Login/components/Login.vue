<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const form = ref({
  username: "",
  password: "",
});

const rememberMe = ref(false);
const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: ["blur", "change"] },
    { min: 3, message: "用户名长度不能少于6位", trigger: ["blur", "change"] },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["blur", "change"] },
    { min: 6, message: "密码长度不能少于6位", trigger: ["blur", "change"] },
  ],
});

const formRef = ref(null);

const login = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("提交的数据", form.value);
      //将账号密码存入local store
      ElMessage.success("登录成功");

    } else {
      ElMessage.error("请填写完整的表单信息");
    }
  });
};
</script>

<template>
  <div class="login">
    <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item class="title">
        <h2>登录</h2>
        <RouterLink to="/register" :style="{ color: 'rgb(145, 192, 233)' }">没有账号? 点击注册</RouterLink>
      </el-form-item>

      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="rememberMe" :style="{ marginRight: 'auto' }">
          记住我
        </el-checkbox>
        <RouterLink to="/password" :style="{ color: 'rgb(145, 192, 233)' }">忘记密码?</RouterLink>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #fff;
  align-items: center;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(0, -8%);
    width: 70%;
    height: 70%;

    &>* {
      margin-bottom: 25px;
    }

    .title {
      display: flex;
      margin-bottom: 20px;

      h2 {
        margin-right: auto;
      }
    }
  }
}
</style>
