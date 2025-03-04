<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { loginAPI } from "@/api/user";
import router from "@/router";

const form = reactive({
  username: "",
  password: "",
});

const rememberMe = ref(false);
const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { pattern: /^(?!\d+$)[a-zA-Z0-9_]{2,49}$/, message: "用户名应为2-49位且不能全为数字" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^(?!\d+$)[a-zA-Z0-9_@#$%^&*!]{6,18}$/, message: "密码长度应在6-18位且不能全为数字" }
  ],
});

const formRef = ref(null);

const login = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await loginAPI(form);
      ElMessage.success("登录成功");
      localStorage.setItem('jwt', res.data.jwt)
      if (rememberMe.value) {
        const userLoginInfo = {
          username: form.username,
          password: form.password
        }
        localStorage.setItem('userLoginInfo', JSON.stringify(userLoginInfo));
      } else {
        localStorage.removeItem('userLoginInfo');
      };
      router.push({ name: 'home' })
    } else {
      ElMessage.error("请填写完整的表单信息");
    };

  });
};

onMounted(() => {
  const userLoginInfo = JSON.parse(localStorage.getItem('userLoginInfo'));
  if (!userLoginInfo) return;
  form.username = userLoginInfo.username;
  form.password = userLoginInfo.password;
  rememberMe.value = true;
})
</script>

<template>
  <div class="login">
    <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item class="title">
        <h2>登录</h2>
        <RouterLink to="/login/register" :style="{ color: 'rgb(145, 192, 233)' }">没有账号? 点击注册</RouterLink>
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
        <RouterLink to="/login/password" :style="{ color: 'rgb(145, 192, 233)' }">忘记密码?</RouterLink>
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
