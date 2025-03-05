<script setup>
import { changeUserInfoAPI, getCodeAPI, getUserInfoAPI, updateEmailAPI, updatePhoneAPI, updateUsernameAPI, uploadAvatarAPI } from "@/api/user";
import { computed, reactive, ref } from "vue"
import { ElMessage } from "element-plus";
import { ElNotification } from 'element-plus';
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();

const checkUserInfo = reactive({
  "username": "",
  "email": "",
  "phone": "",
  "nickname": "",
  "avatar": "",
  "info": "",
  "gender": 0,
  "birthday": "",
  "location": ""
});

const phoneData = reactive({
  phone: '',
  code: ''
});
const emailData = reactive({
  email: '',
  code: ''
})
const getUserInfo = async () => {
  const res = await getUserInfoAPI();
  Object.assign(userStore.userInfo, res.data);
  Object.assign(checkUserInfo, res.data);
}
getUserInfo();

const changeImg = ref(false);
const showChangeImg = () => {
  changeImg.value = true;
}

const hiddenChangeImg = () => {
  changeImg.value = false;
}

const validateFile = (file) => {
  if (file.size > 2097152) {
    ElMessage.error("图片大小不能超过2MB")
    return false;
  }
  return true;
}
const changeAvatar = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    console.log(file.size);
    if (!file) return;
    console.log(222);

    if (!validateFile(file)) return;
    const formData = new FormData();
    formData.append('file', file);
    const avatarRes = await uploadAvatarAPI(formData);
    userStore.userInfo.avatar = avatarRes.data.url;
    await changeUserInfoAPI(userStore.userInfo);
    ElMessage.success('修改成功!');

  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

const gender = computed(() => {
  return userStore.userInfo.gender === 1 ? '男' : (userStore.userInfo.gender === 2 ? '女' : '未知');

});

const info = computed(() => {
  return userStore.userInfo.info ? userStore.userInfo.info : '暂未填写'
});

const email = computed(() => {
  return userStore.userInfo.email ? userStore.userInfo.email : '暂未填写'
});

const location = computed(() => {
  return userStore.userInfo.location ? userStore.userInfo.location : '暂未填写'
});

const birthday = computed(() => {
  return userStore.userInfo.birthday ? userStore.userInfo.birthday : '暂未填写'
});

const commit = async (event) => {
  Object.keys(userStore.userInfo).forEach(key => {
    if (typeof userStore.userInfo[key] === 'string') {
      userStore.userInfo[key] = userStore.userInfo[key].trim();
    }
  });
  await changeUserInfoAPI(userStore.userInfo);
  ElNotification({
    title: 'Success',
    message: '修改成功',
    type: 'success'
  });
  Object.assign(checkUserInfo, userStore.userInfo);
  const li = event.target.closest(".info-input").parentNode;
  if (!li) return;
  li.querySelector('.content-show-r').style.display = 'block';
  li.querySelector('.info-input').style.display = 'none';
  li.querySelector('.edit').style.display = '';
}
const cancle = (event) => {
  Object.assign(userStore.userInfo, checkUserInfo);
  const li = event.target.closest(".info-input").parentNode;
  if (!li) return;
  li.querySelector('.content-show-r').style.display = 'block';
  li.querySelector('.info-input').style.display = 'none';
  li.querySelector('.edit').style.display = '';
}
const disabledDate = (date) => {
  return date > new Date();
};
const editInfo = (event) => {
  const li = event.target.parentNode;
  if (!li) return;
  li.querySelector('.content-show-r').style.display = 'none';
  li.querySelector('.info-input').style.display = 'block';
  event.target.style.display = 'none';
};

const updateUsername = async (event) => {
  await updateUsernameAPI(userStore.userInfo.username);
  ElNotification({
    title: 'Success',
    message: '修改成功',
    type: 'success'
  });
  Object.assign(checkUserInfo, userStore.userInfo);
  cancle(event);
}

const isDisabledPhone = ref(false);
const countdownPhone = ref(5);
const phoneRegex = /^1[3-9]\d{9}$/;

const isDisabledEmail = ref(false);
const countdownEmail = ref(5);
const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

const getPhoneCode = () => {
  if (!phoneRegex.test(userStore.userInfo.phone)) {
    ElNotification({
      title: 'Error',
      message: '手机号格式有误',
      type: 'error'
    });
    return;
  }
  isDisabledPhone.value = true;
  countdownPhone.value = 5;
  const timer = setInterval(() => {
    countdownPhone.value--;
    if (countdownPhone.value <= 0) {
      clearInterval(timer);
      isDisabledPhone.value = false;
    }
  }, 1000);
  getCodeAPI(userStore.userInfo.phone);
}

const updatePhone = async (event) => {
  phoneData.phone = userStore.userInfo.phone;
  if (phoneData.code.length < 6) {
    ElNotification({
      title: 'Error',
      message: '手机验证码长度有误',
      type: 'error'
    });
    return;
  }
  await updatePhoneAPI(phoneData);
  phoneData.code = '';
  ElNotification({
    title: 'Success',
    message: '修改成功',
    type: 'success'
  });
  Object.assign(checkUserInfo, userStore.userInfo);
  cancle(event);

}
const getEmailCode = () => {
  if (!emailRegex.test(userStore.userInfo.email)) {
    ElNotification({
      title: 'Error',
      message: '邮箱格式有误',
      type: 'error'
    });
    return;
  }
  isDisabledEmail.value = true;
  countdownEmail.value = 5;
  const timer = setInterval(() => {
    countdownEmail.value--;
    if (countdownEmail.value <= 0) {
      clearInterval(timer);
      isDisabledEmail.value = false;
    }
  }, 1000);
  getCodeAPI(userStore.userInfo.email);
}
const updateEmail = async (event) => {
  emailData.email = userStore.userInfo.email;
  if (emailData.code.length < 6) {
    ElNotification({
      title: 'Error',
      message: '邮箱验证码长度有误',
      type: 'error'
    });
    return;
  }
  await updateEmailAPI(emailData);
  emailData.data = '';
  ElNotification({
    title: 'Success',
    message: '修改成功',
    type: 'success'
  });
  Object.assign(checkUserInfo, userStore.userInfo);
  cancle(event);

}
</script>

<template>
  <div class="personal-center">
    <div class="container">
      <div class="header">
        <div @mouseenter="showChangeImg" @mouseleave="hiddenChangeImg" :style="{ borderRadius: '50%' }">
          <img class="header-img" :src="userStore.userInfo.avatar" alt="">
          <div class="change-img" v-show="changeImg" @click="changeAvatar">
            <img src="@/assets/icons/camera.svg" alt="">
          </div>
        </div>
        <div class="right">
          <span class="name">{{ userStore.userInfo.nickname }}</span>
          <RouterLink :to="{ name: 'home' }" class="all-conference">查看所有会议</RouterLink>
        </div>
      </div>
      <div class="basic-information">
        <span class="title">基本信息</span>
        <hr>
        <ul class="basic-information-ul" id="infoList">
          <li>
            <div class="content-show-l">用户名</div>
            <div class="content-show-r">{{ userStore.userInfo.username }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.username" style="width: 240px; margin-right: 30px ;"
                placeholder="请输入内容" />
              <el-button type="primary" @click="updateUsername">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">昵称</div>
            <div class="content-show-r">{{ userStore.userInfo.nickname }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.nickname" style="width: 240px; margin-right: 30px ;"
                placeholder="请输入内容" />
              <el-button type="primary" @click="commit">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">性别</div>
            <div class="content-show-r">{{ gender }}</div>
            <div class="info-input">
              <el-radio-group v-model="userStore.userInfo.gender" style="width: 240px; margin-right: 30px ;">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="2">女</el-radio>
                <el-radio :value="3">未知</el-radio>
              </el-radio-group>
              <el-button type="primary" @click="commit">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">签名</div>
            <div class="content-show-r">{{ info }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.info" style="width: 240px; margin-right: 30px ;" placeholder="请输入内容"
                type="textarea" maxlength="80" show-word-limit />
              <el-button type="primary" @click="commit">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">邮箱</div>
            <div class="content-show-r"> {{ email }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.email" style="width: 300px; margin-right: 30px ;"
                placeholder="请输入内容">
                <template #append>
                  <el-button :style="{ fontSize: '14px' }" :disabled="isDisabledEmail" @click="getEmailCode">
                    {{ isDisabledEmail ? `${countdownEmail}s 后重试` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
              <el-input v-model="emailData.code" style="width: 120px; margin-right: 30px ;" placeholder="请输入验证码" />
              <el-button type="primary" @click="updateEmail">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">手机号</div>
            <div class="content-show-r">{{ userStore.userInfo.phone }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.phone" style="width: 300px; margin-right: 30px ;"
                placeholder="请输入内容">
                <template #append>
                  <el-button :style="{ fontSize: '14px' }" :disabled="isDisabledPhone" @click="getPhoneCode">
                    {{ isDisabledPhone ? `${countdownPhone}s 后重试` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
              <el-input v-model="phoneData.code" style="width: 120px; margin-right: 30px ;" placeholder="请输入验证码" />
              <el-button type="primary" @click="updatePhone">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">生日</div>
            <div class="content-show-r">{{ birthday }}</div>
            <div class="info-input">
              <el-date-picker v-model="userStore.userInfo.birthday" type="datetime" placeholder="请选择您的出生日期"
                value-format="YYYY-MM-DD" format="YYYY-MM-DD" :disabled-date="disabledDate"
                style="width: 240px; margin-right: 30px;" />
              <el-button type="primary" @click="commit">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
          <li>
            <div class="content-show-l">地址</div>
            <div class="content-show-r">{{ location }}</div>
            <div class="info-input">
              <el-input v-model="userStore.userInfo.location" style="width: 480px; margin-right: 30px ;" type="text"
                maxlength="30" show-word-limit placeholder="请输入内容" />
              <el-button type="primary" @click="commit">确认</el-button>
              <el-button type="danger" @click="cancle">取消</el-button>
            </div>
            <button class="edit" @click="editInfo">编辑</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.personal-center {

  .container {
    min-width: 900px;
    width: 900px;

    .header {
      position: relative;
      display: flex;
      gap: 16px;
      background: #fff;
      padding: 30px 30px;
      box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.2);
      overflow: hidden;

      .header-img {
        flex-shrink: 0;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.06);
        object-fit: cover;
      }

      .change-img {
        position: absolute;
        display: flex;
        align-items: center;
        width: 90px;
        height: 90px;
        top: 30px;
        left: 30px;
        background: #222226;
        opacity: 0.8;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        object-fit: cover;

        img {
          margin: auto;
          width: 40px;
          height: 40px;
          cursor: pointer;

        }
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-top: 10px;

        .name {
          color: #222226;
          font-weight: 500;
          line-height: 24px;
          font-size: 20px;
          margin-right: auto;
          margin-bottom: 5px;
        }

        .all-conference {
          font-size: 14px;
          font-weight: 400;
          color: #555666;
          line-height: 20px;
          vertical-align: middle;

          &:hover {
            color: #72bedf;

          }
        }
      }
    }


    .basic-information {
      background: #fff;
      box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.2);
      margin-top: 20px;
      padding: 5px 16px;

      .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 48px;
      }

      hr {
        margin: 3px 0 24px 0;
        border: none;
        border-top: 1px solid #7b848b;
      }

      .basic-information-ul {
        padding-left: 18px;

        li {
          min-height: 32px;
          display: flex;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
          cursor: default;
          font-size: 15px;

          &:hover {
            .edit {
              display: block;
            }
          }

          .content-show-l {
            text-align: center;
            width: 48px;
            height: 32px;
            line-height: 32px;
            text-align-last: justify;
            margin-right: 30px;
          }

          .content-show-r {
            max-width: 720px;
            white-space: nowrap;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .info-input {
            display: none;
          }
        }

        .edit {
          display: none;
          color: rgb(113, 182, 182);
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
