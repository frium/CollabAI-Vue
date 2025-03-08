import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useRTEditorStore = defineStore('rtEditor', () => {
  const content = ref('1');

  return {
    content
  }
})
