<script setup>
import { getParticipantsAPI } from '@/api/conference';
import { useConferenceStore } from '@/stores/conferenceStore';
import { computed, onMounted, ref } from 'vue';
import MarkdownViewer from './MarkdownViewer.vue';
import UserInfoCard from './UserInfoCard.vue';
import TurndownService from 'turndown'
const conferenceStore = useConferenceStore();
const participants = ref([]);
const mdContent = ref('');


const turndown = new TurndownService({
  codeBlockStyle: 'fenced',  // 强制使用 ``` 代码块
  headingStyle: 'atx',       // 强制使用 # 标题
  fence: '```',              // 明确指定围栏符
  blankReplacement: (content, node) => {
    return node.isBlock ? '\n\n' : '' // 处理空行
  }
});
turndown.addRule('codeBlock', {
  filter: ['pre'],
  replacement: (content, node) => {
    const code = node.querySelector('code')
    const lang = code?.className.replace('language-', '') || ''
    return `\n\`\`\`${lang}\n${code?.textContent}\n\`\`\`\n`
  }
})
onMounted(async () => {
  if (!conferenceStore.startConferenceInfo.title) {
    await conferenceStore.getStartConferenceInfo();
  }
  const res = await getParticipantsAPI(conferenceStore.startConferenceInfo.id);
  participants.value = res.data;
  mdContent.value = turndown.turndown(conferenceStore.startConferenceInfo.mdContent);
  console.log(conferenceStore.startConferenceInfo.mdContent);

  console.log(mdContent.value);

});
const conferenceLink = computed(() => window.location.origin + '/joinConference/' + conferenceStore.startConferenceInfo.id);

const showAllDoc = ref(false);
const changeDocumentstate = () => {
  showAllDoc.value = !showAllDoc.value;
}



</script>

<template>
  <div class="conference-detail">
    <h4>会议信息</h4>
    <ul class="conference-info">
      <li class="info-li">
        <span class="title">会议号</span>
        <span>{{ conferenceStore.startConferenceInfo.id }}</span>
      </li>
      <li class="info-li">
        <span class="title">会议连接</span>
        <span>{{ conferenceLink }}</span>
      </li>
      <li class="info-li">
        <span class="title">开始时间</span>
        <span>{{ conferenceStore.startConferenceInfo.startTime }}</span>
      </li>
      <li class="info-li">
        <span class="title">结束时间</span>
        <span>{{ conferenceStore.startConferenceInfo.endTime }}</span>
      </li>
    </ul>
    <div class="head">
      <h4 style="margin: 20px 0 10px 0;">会议文档</h4>
      <div>
        <button @click="changeDocumentstate" v-if="!showAllDoc">展开文档</button>
        <button @click="changeDocumentstate" v-else>收起文档</button>
      </div>
    </div>
    <MarkdownViewer class="markdown" :source="mdContent" :line-numbers="true"
      :style="{ height: showAllDoc ? '100%' : '380px' }">
    </MarkdownViewer>
    <h4 style="margin: 20px 0 10px 0;">参会人员:</h4>
    <div class="participants">
      <template v-for="participant in participants" :key="participant.userId">
        <UserInfoCard :head-img="participant.headImg" :username="participant.username"></UserInfoCard>
      </template>
      <button class="remove-attendee">
        <img src="@/assets/icons/subtract.svg" alt="">
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conference-detail {
  width: 100%;
  background: #fff;
  box-shadow: 2px 5px 10px 3px rgba(0, 0, 0, 0.2);
  padding: 20px 30px;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 5px;
  }

  .markdown {
    padding: 6px 25px;
    width: 100%;
    overflow: auto;
    border: 1px solid rgb(197, 192, 192);
  }

  .conference-info {
    .info-li {
      display: flex;
      gap: 60px;

      .title {
        color: rgb(123, 129, 143);
        display: block;
        width: 75px;
        text-align-last: justify
      }
    }

    li {
      margin: 10px 0;
    }
  }

  .participants {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, auto));
    justify-content: start;
    gap: 20px 30px;
    width: 100%;
    margin-top: 15px;

    .remove-attendee {
      display: flex;
      align-items: center;
      width: 52px;
      height: 52px;
      border: 2px dashed #bfbfbf;
      border-radius: 10%;

      &:hover {
        border: 2px dashed #898989;
      }

      img {
        width: 26px;
        margin: auto;
      }
    }
  }
}
</style>
