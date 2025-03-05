<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getCodeAPI, registerAPI, usernameUniqueCheckAPI } from '@/api/user';

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
  phone: "",
  code: "",
});
const formRef = ref(null);
const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { pattern: /^(?!\d+$)[a-zA-Z0-9_]{2,49}$/, message: "用户名应为2-49位且不能全为数字" },
    {
      validator: (_, value, callback) => {
        usernameUniqueCheckAPI(value).then(res => {
          res.code === 200 ? callback() : callback(new Error(res.msg))
        }).catch(() => callback());
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^(?!\d+$)[a-zA-Z0-9_@#$%^&*!]{6,18}$/, message: "密码长度应在6-18位且不能全为数字" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
  ]
});
const isDisabled = ref(false);
const countdown = ref(5);

const getCode = () => {
  formRef.value.validateField("phone", (valid) => {
    if (!valid) return;
    isDisabled.value = true;
    countdown.value = 5;
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        isDisabled.value = false
      }
    }, 1000);
    getCodeAPI(form.phone);
  });
}

const register = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    await registerAPI(form);
    ElMessage.success('注册成功!');
    router.push({ name: 'login' });
  } else {
    ElMessage.error("请填写完整的表单信息");
  }
}

</script>

<template>
  <div class="password">
    <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item class="title">
        <h2>注册</h2>
        <RouterLink :to="{ name: 'login' }" :style="{ color: 'rgb(145, 192, 233)' }">已有账号? 点击登录</RouterLink>
      </el-form-item>

      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.code" placeholder="请输入验证码">
          <template #append>
            <el-button :style="{ fontSize: '14px' }" :disabled="isDisabled" @click="getCode">
              {{ isDisabled ? `${countdown}s 后重试` : '获取验证码' }}
            </el-button>
          </template>
        </el-input>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register" style="width: 100%">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.password {
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
