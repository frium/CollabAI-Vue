<script setup>
import { useRTEditorStore } from '@/stores/rtEditorStore';
import Vditor from 'vditor'
import 'vditor/dist/index.css';
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

const vditor = ref()
const rtEditorStore = useRTEditorStore();

// 监听 store 中内容的变化，更新编辑器
watch(() => rtEditorStore.content, (newVal) => {
  console.log(3213121);

  if (vditor.value && vditor.value.getValue() !== newVal) {
    vditor.value.setValue(newVal);
  }
});

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    value: rtEditorStore.content,
    height: 'calc(70vh)',
    width: '880px',
    placeholder: '开始创作吧...',
    theme: 'classic',
    mode: 'ir',
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'code',
      'inline-code',
      'insert-after',
      'insert-before',
      '|',
      'table',
      'link',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'preview',
      'both',
      'export',
    ],
    toolbarConfig: {
      pin: true,
    },
    counter: {
      enable: true,
      type: 'markdown',
    },
    preview: {
      delay: 500,
      mode: 'editor',
      url: '/api/markdown',
      parse: (element) => {
      },
    },
    tab: '  ',
    typewriterMode: true,
    select: {
      enable: true,
    },
    outline: {
      enable: true,
      position: 'right',
    },
    after: () => {
      console.log('编辑器初始化完成');
    },
    cdn: '',
    icon: 'material',
    debugger: true,
    adjustToolbarPosition: true,
    resize: {
      enable: true,
      position: 'bottom',
    },
    classes: {
      preview: 'custom-preview-class',
    },
    lang: 'zh_CN',
    input: (value) => {
      rtEditorStore.content = value;
    },
    blur: (value) => {
      rtEditorStore.content = value;
    },
  });
})
onBeforeUnmount(() => {
  rtEditorStore.content = '';
  if (vditor.value == null) return;
  vditor.value.destroy();
})

</script>

<template>
  <div id="vditor"></div>
</template>