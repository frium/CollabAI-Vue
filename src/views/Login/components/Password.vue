<script setup>
import { useRouter } from 'vue-router';
import { ref } from "vue";
import { ElMessage } from "element-plus";
const router = useRouter();
const form = ref({
  username: "",
  password: "",
  phone: "",
  verification: "",
});
const formRef = ref(null);
const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: ["blur", "change"] },
    { min: 3, message: "用户名长度不能少于6位", trigger: ["blur", "change"] },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["blur", "change"] },
    { min: 6, message: "密码长度不能少于6位", trigger: ["blur", "change"] },
  ],
  phone: [
    {
      required: true, message: "请输入手机号", trigger: ["blur", "change"]
    },
    {
      pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: ["blur", "change"]
    }
  ],
  verification: [
    {
      required: true, message: "请输入验证码", trigger: ["blur", "change"]
    },
  ]
});

const getVerification = () => {
  formRef.value.validateField("phone", (valid) => {
    if (!valid) return;
    console.log('获取验证码');
  });
}

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("提交的数据", form.value);
      ElMessage.success("密码修改成功");
      router.push({ name: 'login' })
    } else {
      ElMessage.error("请填写完整的表单信息");
    }
  });
}
</script>

<template>
  <div class="password">
    <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item class="title">
        <h2>忘记密码</h2>
        <RouterLink to="/login" :style="{ color: 'rgb(145, 192, 233)' }">已有账号? 点击登录</RouterLink>
      </el-form-item>

      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="verification">
        <el-input v-model="form.verification" placeholder="请输入验证码">
          <template #append>
            <el-button :style="{ fontSize: '14px' }" @click="getVerification">获取验证码</el-button>
          </template>
        </el-input>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" style="width: 100%">提交</el-button>
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
