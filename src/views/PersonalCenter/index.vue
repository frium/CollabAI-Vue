<script setup>
import { changeUserInfoAPI, getUserInfoAPI, uploadAvatarAPI } from "@/api/user";
import { computed, reactive, ref } from "vue"
import { ElMessage } from "element-plus";

const userInfo = reactive({
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
const getUserInfo = async () => {
  const res = await getUserInfoAPI();
  Object.assign(userInfo, res.data);
}
getUserInfo();
console.log(userInfo);

const changeImg = ref(false);
const showChangeImg = () => {
  changeImg.value = true;

}

const hiddenChangeImg = () => {
  changeImg.value = false;
}

const changeAvatar = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // const validation = validateFile(file);
    // if (!validation.valid) {
    //   alert(validation.message);
    //   return;
    // } 验证图片函数

    try {
      const formData = new FormData();
      formData.append('file', file);
      const avatarRes = await uploadAvatarAPI(formData);
      console.log(avatarRes);
      if (avatarRes.code !== 200) {
        ElMessage.error('修改失败!');
        return;
      }
      userInfo.avatar = avatarRes.data.url;
      const infoRes = await changeUserInfoAPI(userInfo);
      console.log(infoRes);

      if (infoRes.code !== 200) {
        ElMessage.error('修改失败!');
        return;
      }
      ElMessage.success('修改成功!');
    } catch (error) {
      ElMessage.error('头像更新失败，请重试');
    }
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

const gender = computed(() => {
  return userInfo.gender === 1 ? '男' : '女'
});

const info = computed(() => {
  return userInfo.info.length === 0 ? '暂未填写' : userInfo.info
});

const email = computed(() => {
  return userInfo.email.length === 0 ? '暂未填写' : userInfo.email
});

const location = computed(() => {
  return userInfo.location.length === 0 ? '暂未填写' : userInfo.location
});
const birthday = computed(() => {
  return userInfo.birthday.length === 0 ? '暂未填写' : userInfo.birthday
});


</script>

<template>
  <div class="personal-center">
    <div class="container">
      <div class="header">
        <div @mouseenter="showChangeImg" @mouseleave="hiddenChangeImg" :style="{ borderRadius: '50%' }">
          <img class="header-img" :src="userInfo.avatar" alt="">
          <div class="change-img" v-show="changeImg" @click="changeAvatar">
            <img src="@/assets/icons/camera.svg" alt="">
          </div>
        </div>
        <div class="right">
          <span class="name">{{ userInfo.nickname }}</span>
          <RouterLink to="/home" class="all-conference">查看所有会议</RouterLink>
        </div>
      </div>
      <div class="basic-information">
        <span class="title">基本信息</span>
        <hr>
        <ul class="basic-information-ul">


          <li>
            <div class="content-show-l">用户名</div>
            <div class="content-show-r">{{ userInfo.username }}</div>
            <button class="edit">编辑</button>

          </li>
          <li>
            <div class="content-show-l">昵称</div>
            <div class="content-show-r">{{ userInfo.nickname }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">性别</div>
            <div class="content-show-r">{{ gender }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">签名</div>
            <div class="content-show-r">{{ userInfo.info }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">邮箱</div>
            <div class="content-show-r"> {{ userInfo.email }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">手机号</div>
            <div class="content-show-r">{{ userInfo.phone }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">生日</div>
            <div class="content-show-r">{{ userInfo.birthday }}</div>
            <button class="edit">编辑</button>
          </li>
          <li>
            <div class="content-show-l">地址</div>
            <div class="content-show-r">{{ userInfo.location }}</div>
            <button class="edit">编辑</button>
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
        padding-left: 10px;

        li {
          display: flex;
          -webkit-box-align: baseline;
          -ms-flex-align: baseline;
          align-items: baseline;
          margin-bottom: 32px;

          .content-show-l {
            width: 46px;
            height: 24px;
            text-align-last: justify;
            margin-right: 30px;
          }
        }
      }

      .edit {
        color: rgb(47, 79, 79);
        margin-left: 20px;
      }
    }




  }

}
</style>
