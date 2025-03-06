<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateThumbnails } from '@/utils/upload';
import RichTextEditor from './components/RichTextEditor.vue';
import { createConferenceAPI } from '@/api/conference';
import { useRouter } from 'vue-router';
import { uploadCoverImgAPI } from '@/api/conference';

const router = useRouter();
const form = reactive({
  title: '',
  startTime: '',
  endTime: '',
  mdContent: '',
  coverImg: '',
});
const time = ref([]);
const thumbnailUrl = ref('');
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
const uploadCoverImg = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    console.log(file.size);
    if (!file) return;
    if (!validateFile(file)) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadCoverImgAPI(formData);
    form.coverImg = res.data.url;
    const thumbnail = await generateThumbnails(file);
    thumbnailUrl.value = thumbnail;
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}
// 更新富文本编辑器内容
const update = (content) => {
  form.mdContent = content;
};


const submit = async () => {
  form.startTime = time.value[0];
  form.endTime = time.value[1];
  form.mdContent = JSON.stringify(form.mdContent);
  await createConferenceAPI(form);
  ElMessage.success('预定成功!');
  router.push({ name: 'home' })
}
const backToHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="create-conference">
    <h2>预定会议</h2>
    <el-form :model="form" label-width="auto" style="max-width: 100% ;margin-top: 30px;">
      <el-form-item label="会议主题:" style="width: 425px;">
        <el-input v-model="form.title" size="large" />
      </el-form-item>

      <el-form-item label="会议时间:" style="width: 425px;">
        <el-date-picker v-model="time" type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm"
          size="large" />
      </el-form-item>

      <el-form-item label="会议封面(可选):">
        <div style=" height: 90px; min-width: 90px;  position: relative; background-color: #ddd;">
          <div @mouseenter="showChangeImg" @mouseleave="hiddenChangeImg" style="height: 100%;">
            <img v-if="thumbnailUrl" :src="thumbnailUrl" style="height: 90px; border: 1px solid #ddd;" />
            <div class="change-img" v-show="changeImg" @click="uploadCoverImg">
              <img src="@/assets/icons/camera.svg" alt="">
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="会议大纲(可选):">
      </el-form-item>
      <div class="richtext-editor">
        <RichTextEditor :content="form.mdContent" @update="update"></RichTextEditor>
      </div>
    </el-form>
    <div style=" margin-top: 20px;">
      <el-button type="primary" @click="submit">预定会议</el-button>
      <el-button @click="backToHome">取消预定</el-button>
    </div>
  </div>
</template>


<style scoped lang="scss">
.create-conference {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1010px;
  margin: auto;
  padding: 30px 50px;
  background: #fff;

  .change-img {
    position: absolute;
    display: flex;
    align-items: center;
    width: 100%;
    height: 90px;
    top: 0px;
    left: 0px;
    background: #222226;
    opacity: 0.8;
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

  .richtext-editor {
    width: 100%;
  }
}
</style>
