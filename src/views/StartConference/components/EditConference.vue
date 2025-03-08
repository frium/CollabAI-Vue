<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateThumbnails } from '@/utils/upload';
import RichTextEditor from '@/views/CreatConference/components/RichTextEditor.vue';
import { updateConferenceInfoAPI } from '@/api/conference';
import { useRouter } from 'vue-router';
import { uploadCoverImgAPI } from '@/api/conference';
import { useRTEditorStore } from '@/stores/rtEditorStore';
import { useConferenceStore } from '@/stores/conferenceStore';

const props = defineProps({
  conferenceInfo: {
    type: Object
  }
});

const conferenceStore = useConferenceStore();
const router = useRouter();
const form = ref({
  id: '',
  title: '',
  startTime: '',
  endTime: '',
  mdContent: '',
  coverImg: '',
});


const time = ref([]);

const thumbnailUrl = ref('');

const changeImg = ref(false);
const rtEditorStore = useRTEditorStore();

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
    if (!file) return;
    if (!validateFile(file)) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadCoverImgAPI(formData);
    form.value.coverImg = res.data.url;
    const thumbnail = await generateThumbnails(file);
    thumbnailUrl.value = thumbnail;
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

const submit = async () => {
  form.value.startTime = time.value[0];
  form.value.endTime = time.value[1];
  form.value.mdContent = JSON.stringify(rtEditorStore.content);
  await updateConferenceInfoAPI(form.value);
  ElMessage.success('修改成功!');
  conferenceStore.startConferenceInfo.mdContent = rtEditorStore.content;
  conferenceStore.startConferenceInfo.startTime = time.value[0];
  conferenceStore.startConferenceInfo.endTime = time.value[1];
  conferenceStore.startConferenceInfo.title = form.value.title;
  router.push({ name: 'conferenceAI' })
}
const backToHome = () => {
  router.push({ name: 'conferenceAI' })
}

onMounted(async () => {
  if (!conferenceStore.startConferenceInfo.title) {
    await conferenceStore.getStartConferenceInfo();
  }
  Object.keys(form.value).forEach(key => {
    if (conferenceStore.startConferenceInfo[key] !== undefined) {
      form.value[key] = conferenceStore.startConferenceInfo[key];
    }
  });
  time.value = [form.value.startTime, form.value.endTime];
  thumbnailUrl.value = form.value.coverImg;
  rtEditorStore.content = form.value.mdContent;
})
</script>

<template>
  <div class="create-conference">
    <h2>编辑会议</h2>
    <el-form :model="form" label-width="auto" style="width: 100% ;margin-top: 30px;">
      <el-form-item label="会议主题:" style="width: 425px;">
        <el-input v-model="form.title" size="large" />
      </el-form-item>

      <el-form-item label="会议时间:" style="width: 425px;">
        <el-date-picker v-model="time" type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm"
          size="large" />
      </el-form-item>

      <el-form-item label="会议封面(可选):">
        <div style=" height: 91px; min-width: 90px;  position: relative; border:1px solid #d0cece;">
          <div @mouseenter="showChangeImg" @mouseleave="hiddenChangeImg" style="height: 100%;">
            <img v-if="thumbnailUrl" :src="thumbnailUrl" style="height: 90px; min-width: 90px;" />
            <img v-else src="@/assets/icons/add.svg"
              style=" position: absolute; top: 50%;left:50%; transform: translate(-50%,-50%);" />
            <div class="change-img" v-show="changeImg" @click="uploadCoverImg">
              <img src="@/assets/icons/camera.svg" alt="">
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="会议大纲(可选):">
      </el-form-item>
      <div class="richtext-editor">
        <RichTextEditor v-if="form.mdContent"></RichTextEditor>
      </div>
    </el-form>
    <div style=" margin-top: 20px;">
      <el-button type="primary" @click="submit">确认修改</el-button>
      <el-button @click="backToHome">取消修改</el-button>
      <el-button type="danger">解散会议</el-button>
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
  background: #ffffff;
  box-shadow: 2px 5px 10px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;

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
